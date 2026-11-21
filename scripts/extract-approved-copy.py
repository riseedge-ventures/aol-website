import fitz,json,re
from pathlib import Path
import sys
pdf=fitz.open(sys.argv[1])
sections=[];current=None;last=None
for pn,page in enumerate(pdf):
 if pn==0 or pn==17:continue
 for b in page.get_text('dict')['blocks']:
  if 'lines' not in b:continue
  spans=[s for l in b['lines'] for s in l['spans']]
  size=max(s['size'] for s in spans)
  text=' '.join(''.join(s['text'] for s in l['spans']) for l in b['lines']).strip()
  if b['bbox'][1]>790 or size<9 or size>16:continue
  if size>11.5:
   current={'label':text,'page':pn+1,'blocks':[]};sections.append(current);last=None;continue
  if not current:continue
  if text=='DEVELOPER REFERENCE — LEARN MORE BUTTON DESTINATIONS':break
  kind='heading' if size>10 else 'bullet' if text.startswith('• ') else 'paragraph'
  bold=all('Bold' in s['font'] for s in spans if s['text'].strip())
  italic=all('Oblique' in s['font'] for s in spans if s['text'].strip())
  runs=[]
  for li,line in enumerate(b['lines']):
   if li:runs.append({'text':' '})
   for span in line['spans']:
    runs.append({'text':span['text'],'bold':'Bold' in span['font'],'italic':'Oblique' in span['font']})
  block={'runs':runs,'kind':kind,'text':text,'bold':bold,'italic':italic,'page':pn+1}
  if last and kind!='heading' and not text.startswith(('• ','[')) and last['kind']!='heading' and (b['bbox'][1]-last['_bottom']<4 and last['page']==pn+1 or last['page']!=pn+1 and text[0].islower() and not re.search(r'[.!?:;\]]$',last['text'])):
   last['runs'] += [{'text':' '}] + runs;last['text']+=' '+text;last['bold']=last['bold'] and bold;last['_bottom']=b['bbox'][3];last['page']=pn+1
  else:
   block['_bottom']=b['bbox'][3];current['blocks'].append(block);last=block
for s in sections:
 for b in s['blocks']: b.pop('_bottom',None)
Path('src/content/approved-copy.json').write_text('[\n' + ',\n'.join('  {\n    \"label\": ' + json.dumps(section['label'], ensure_ascii=False) + ',\n    \"page\": ' + str(section['page']) + ',\n    \"blocks\": [\n' + ',\n'.join('      ' + json.dumps(block, ensure_ascii=False) for block in section['blocks']) + '\n    ]\n  }' for section in sections) + '\n]\n')
for i,s in enumerate(sections):print(i,s['page'],s['label'],len(s['blocks']))
