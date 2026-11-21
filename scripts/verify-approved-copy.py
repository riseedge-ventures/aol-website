"""Independently compare pypdf source extraction and built visible HTML to owner copy.
Usage: python scripts/verify-approved-copy.py /absolute/path/owner.pdf
"""
import json, re, sys
from pathlib import Path
from urllib.parse import unquote, urlparse
from pypdf import PdfReader
from bs4 import BeautifulSoup

copy = json.loads(Path('src/content/approved-copy.json').read_text())
# pypdf represents this PDF's bullet glyph as DEL; PyMuPDF resolves it to U+2022.
compact = lambda text: re.sub(r'\s+', '', text.replace('\x7f', '•'))
source = []
major_pages = {1, 2, 15, 18, 74, 92, 97, 101}
for number, page in enumerate(PdfReader(sys.argv[1]).pages):
    if number in {0, 17}:
        continue
    lines = page.extract_text().splitlines()[2:]
    if number in major_pages:
        lines = lines[1:]
    source.append('\n'.join(lines))
source = '\n'.join(source)
for i, section in enumerate(copy):
    pattern = re.escape(section['label']) + r'\nSource:[^\n]*\n'
    source, count = re.subn(pattern, f'\n@@SECTION_{i}@@\n', source, count=1)
    assert count == 1, (i, 'missing source boundary')
parts = re.split(r'@@SECTION_\d+@@', source)[1:]
assert len(parts) == len(copy) == 31
for i, (part, section) in enumerate(zip(parts, copy)):
    part = part.split('DEVELOPER REFERENCE — LEARN MORE BUTTON DESTINATIONS')[0]
    expected = ''.join(b['text'] for b in section['blocks'])
    assert compact(part) == compact(expected), (i, 'PDF extraction changed or omitted text')
    for b in section['blocks']:
        assert ''.join(r['text'] for r in b['runs']) == b['text']
print('PASS: all 31 sections independently match PDF text, including punctuation; all emphasis runs match.')

slugs = ['bookkeeping', 'payroll', 'tax-services', 'financial-statements', 'management-accounting', 'business-advisory', 'cipc-services', 'xero-accounting', 'cash-flow-management', 'accounting-training']
routes = {0: '/'}
routes.update({i:'/about/' for i in range(1, 7)})
routes[7] = '/services/'
routes.update({i+8:f'/services/{slug}/' for i, slug in enumerate(slugs)})
routes.update({i:'/industries/' for i in range(18, 24)})
routes.update({24:'/pricing/', 25:'/insights/'})
routes.update({i:'/contact/' for i in range(26, 31)})
failures = []
checked = 0

def rendered_passages(block):
    text = block['text']
    if text.startswith('['):
        return re.findall(r'\[([^\]]+)\]', text)
    if re.match(r'^(?:(?:Primary|Secondary|Form) Action|Action): ', text):
        return [text.split(': ', 1)[1]]
    return [text.removeprefix('• ')]

for i, section in enumerate(copy):
    html = BeautifulSoup(Path('out'+routes[i]+'index.html').read_text(), 'html.parser')
    for tag in html(['script', 'style']): tag.decompose()
    visible = compact(html.get_text())
    for j, b in enumerate(section['blocks']):
        for passage in rendered_passages(b):
            if compact(passage) not in visible:
                failures.append((routes[i], i, j, passage))
            checked += 1
    if i == 7:
        for slug in slugs:
            assert html.select_one(f'a[href="/services/{slug}/"]'), ('missing service destination', slug)
    if i == 29:
        form = html.select_one('form.modal__form')
        assert form and form.get('name') == 'aol-website-enquiries'
        for field in ['name', 'email', 'phone', 'service', 'message']:
            assert form.select_one(f'[name="{field}"][required]'), ('required field missing', field)
        assert form.select_one('[name="consultation_type"]')
        service_options = [option.get_text(strip=True) for option in form.select('[name="service"] option')]
        consultation_options = [(radio.get('value'), radio.find_parent('label').get_text(' ', strip=True)) for radio in form.select('input[type="radio"][name="consultation_type"]')]
        assert service_options[0] == 'Area of Assistance'
        assert service_options[-1] == 'You do not need to know which accounting service applies to your circumstances before contacting us.'
        assert consultation_options == [
            ('online', 'Free Online Consultation Consultation Fee: Free'),
            ('office', 'Office Consultation Consultation Fee: R300'),
        ]
        assert not any(radio.has_attr('required') for radio in form.select('input[type="radio"][name="consultation_type"]'))
        form_text = compact(form.get_text())
        for fee_text in ['Free Online Consultation', 'Consultation Fee: Free', 'Office Consultation', 'Consultation Fee: R300']:
            assert compact(fee_text) in form_text, ('consultation fee disclosure missing', fee_text)
        detector = html.select_one('form.netlify-form-detector')
        assert detector.select_one('[name="consultation_type"]')
assert not failures, '\n'.join(map(str, failures))
print(f'PASS: {checked} approved passages/labels present on their matching built routes; ten Learn More destinations and required enquiry fields verified.')

# A page-wide presence check can pass when text is hidden in shared chrome or a modal.
# Verify each approved block is in its intended main-content sequence, while the
# form specification itself is in the enquiry form sequence.
for route in sorted(set(routes.values())):
    html = BeautifulSoup(Path('out'+route+'index.html').read_text(), 'html.parser')
    main = html.select_one('main')
    assert main, ('main content missing', route)
    main_text = compact(main.get_text())
    cursor = 0
    for section_index in [i for i in range(len(copy)) if routes[i] == route]:
        section_blocks = copy[section_index]['blocks']
        if section_index == 29:
            section_blocks = section_blocks[:6] + section_blocks[18:]
        for block in section_blocks:
            for passage in rendered_passages(block):
                needle = compact(passage)
                position = main_text.find(needle, cursor)
                assert position >= 0, ('main sequence or placement mismatch', route, section_index, passage)
                cursor = position + len(needle)

contact = BeautifulSoup(Path('out/contact/index.html').read_text(), 'html.parser')
form = contact.select_one('form.modal__form')
modal_card = contact.select_one('.modal__card')
assert form and modal_card, 'enquiry modal structure missing'
form_text = compact(modal_card.get_text())
cursor = 0
for block in copy[29]['blocks'][6:18]:
    for passage in rendered_passages(block):
        needle = compact(passage)
        position = form_text.find(needle, cursor)
        assert position >= 0, ('form sequence or placement mismatch', passage)
        cursor = position + len(needle)
print('PASS: approved blocks occur in their intended main-content or form sequence, not merely somewhere in the page HTML.')

home = BeautifulSoup(Path('out/index.html').read_text(), 'html.parser')
hero_actions = compact(home.select_one('.hero__cta').get_text())
assert hero_actions.index(compact('Explore Our Services')) < hero_actions.index(compact('Book a Free Online Consultation'))
closing_actions = compact(home.select_one('.ctaband__cta').get_text())
assert closing_actions.index(compact('Submit an Enquiry')) < closing_actions.index(compact('Book a Free Online Consultation'))
assert home.select_one('.ctaband__cta button') and compact(home.select_one('.ctaband__cta button').get_text()) == compact('Submit an Enquiry')
print('PASS: home hero and closing call-to-action controls follow the owner-supplied primary/secondary order.')

pricing = BeautifulSoup(Path('out/pricing/index.html').read_text(), 'html.parser')
for label in ['Enquire About Foundation', 'Enquire About Growth', 'Enquire About Professional']:
    assert any(compact(button.get_text()) == compact(label) for button in pricing.select('.aol-pricing__cta button')), ('package enquiry does not open form', label)

header_source = Path('src/components/interactive/Header.tsx').read_text()
book_source = Path('src/components/interactive/BookButton.tsx').read_text()
assert 'openConsultation("online")' in header_source, 'header Free Online action does not select online consultation'
assert '"Request an Office Consultation" ? "office"' in book_source
assert '"Book a Free Online Consultation" ? "online"' in book_source
print('PASS: consultation and package action controls open the form with the required online/office intent mappings.')

public_routes = sorted(set(routes.values()))
for route in public_routes:
    html = BeautifulSoup(Path('out'+route+'index.html').read_text(), 'html.parser')
    for anchor in html.select('a[href]'):
        href = anchor['href']
        parsed = urlparse(href)
        if parsed.scheme in {'http', 'https', 'mailto', 'tel'} or href.startswith('//'):
            continue
        target_route = parsed.path or route
        if not target_route.startswith('/'):
            target_route = str(Path(route) / target_route)
        target_route = '/' + target_route.strip('/') + ('/' if target_route.strip('/') else '')
        target_file = Path('out'+target_route+'index.html')
        assert target_file.exists(), ('broken internal link', route, href, target_file)
        if parsed.fragment:
            target_html = BeautifulSoup(target_file.read_text(), 'html.parser')
            fragment = unquote(parsed.fragment)
            assert target_html.find(id=fragment), ('missing internal link target', route, href, fragment)

whatsapp_href = home.select_one('a[href*="wa.me"]')['href']
assert 'Hello AOL Accountants' in unquote(whatsapp_href), ('WhatsApp greeting changed', whatsapp_href)
about_image = home.select_one('.about__media img')
assert about_image and about_image.get('src') == '/assets/media/aol-office-stock-1600.webp', ('approved optimized stock image missing', about_image)
assert Path('out/assets/media/aol-office-stock-1600.webp').exists(), 'approved optimized stock image was not exported'
assert Path('docs/assets/aol-office-stock-source.jpg').exists(), 'approved source photograph was not retained for internal provenance'
assert not Path('out/assets/media/aol-office-stock.jpg').exists(), 'uncropped source photograph remains publicly exposed'
assert Path('out/assets/logo/aol-logo-full-optimized.webp').exists(), 'optimized supplied logo was not exported'
assert Path('out/assets/media/aol-office-stock-1600.webp').stat().st_size <= 150_000, 'optimized office image exceeds its performance budget'
assert Path('out/assets/logo/aol-logo-full-optimized.webp').stat().st_size <= 125_000, 'optimized logo exceeds its performance budget'
print(f'PASS: all internal links and fragment targets resolve across {len(public_routes)} public routes; WhatsApp greeting uses the approved public name.')

css = Path('src/app/globals.css').read_text()
assert '.about__media { aspect-ratio: 5 / 6; }' in css, 'desktop About image ratio changed'
assert 'aspect-ratio: 2 / 1' in css, 'face-safe mobile About image ratio is missing'
assert 'object-position: 50% 0%' in css, 'face-safe mobile image position is missing'
assert '@media (max-width: 360px)' in css and '.page-hero .aol-secheading__title' in css, 'small-phone heading rule missing'
assert '.page-content a { overflow-wrap: anywhere; }' in css, 'long mobile links are not protected from clipping'
print('PASS: mobile-first image ratio, small-phone heading scale and long-link wrapping safeguards are present.')

for route in set(routes.values()):
    html = BeautifulSoup(Path('out'+route+'index.html').read_text(), 'html.parser')
    for tag in html(['script', 'style']): tag.decompose()
    text = html.get_text()
    for forbidden in ['Source: “Plan Home', 'DEVELOPER REFERENCE', 'Most Popular', '≈100–500', '≈500–1,500', 'Once-off professional services from R450', 'Planned resource topic — article not published yet']:
        assert forbidden not in text, (route, forbidden)

for route in sorted(set(routes.values())):
    html = BeautifulSoup(Path('out'+route+'index.html').read_text(), 'html.parser')
    for node in html.find_all(True):
        for attr in ['alt', 'aria-label', 'href']:
            value = node.get(attr)
            if isinstance(value, str):
                assert 'AOL Accounting Academy SA' not in value, (route, attr, value)

    visible_text = html.get_text(' ', strip=True)
    assert '2025/645278/07' not in visible_text, ('company registration number remains public', route)
    assert 'All documents, including the company registration, are available upon request.' in visible_text, ('supporting-document notice missing', route)

for index, service in enumerate(slugs):
    html = BeautifulSoup(Path(f'out/services/{service}/index.html').read_text(), 'html.parser')
    expected_title = copy[8 + index]['blocks'][0]['text']
    assert html.title and html.title.get_text() == expected_title, ('service title changed', service, html.title)
print('PASS: no PDF provenance/developer instructions or superseded pricing/insight claims in rendered pages.')
