import type { IconName } from "@/components/ui/Icon";

export type ServiceItem = {
  icon: IconName;
  title: string;
  /** Locked owner description. */
  description: string;
  /** Public URL segment under /services/ */
  slug: string;
  /** Short meta description for the dedicated landing page. */
  metaDescription: string;
  /** Extra “how we can help” bullets derived from the locked description (no new claims). */
  helpPoints: string[];
  relatedSlugs: string[];
  tagline: string;
  approvedSection: number;
};

export const SERVICES: ServiceItem[] = [
  {
    "icon": "calculator",
    "title": "01 — Accounting & Bookkeeping",
    "slug": "bookkeeping",
    "description": "General Ledger Accounting | Bank & Cash Reconciliations | Debtors & Creditors Reconciliations | Accounts Payable & Receivable | Trial Balance Preparation | Journal Entries & Adjustments | Fixed Asset Registers | Monthly Bookkeeping | Financial Reporting",
    "tagline": "Accurate Records. Reliable Reconciliations. Financial Integrity.",
    "metaDescription": "Every reliable financial report begins with transactions that have been accurately recorded, appropriately classified and properly reconciled",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 8
  },
  {
    "icon": "receipt",
    "title": "02 — Payroll Administration",
    "slug": "payroll",
    "description": "Payroll Processing | Payslip Preparation | PAYE | UIF | SDL | EMP201 — Monthly Employer Declarations | EMP501 — Employer Reconciliations | IRP5/IT3(a) Certificates | Employee Tax Reconciliations | Payroll Records & Reporting",
    "tagline": "Accurate Payroll Processing. Responsible Statutory Administration.",
    "metaDescription": "Every payroll period involves financial calculations, employee obligations and statutory responsibilities that require accuracy, consistency and proper administration.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 9
  },
  {
    "icon": "landmark",
    "title": "03 — Taxation Services",
    "slug": "tax-services",
    "description": "ITR12 — Individual Income Tax | ITR14 — Corporate Income Tax | IRP6 — Provisional Tax | ITR12T — Trust Income Tax | VAT201 — VAT Returns | Tax Registrations | Tax Compliance Status (TCS) | Tax Computations & Assessments | SARS Objections & Appeals | Tax Planning & Advisory",
    "tagline": "Technical Tax Expertise. Statutory Compliance. Responsible Tax Planning.",
    "metaDescription": "Every tax obligation begins with a legal requirement. Every tax computation demands technical accuracy. Every submission carries responsibilities that extend beyond the filing of a return.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 10
  },
  {
    "icon": "file-text",
    "title": "04 — Financial Statements",
    "slug": "financial-statements",
    "description": "Annual Financial Statements | Statement of Financial Position | Statement of Profit or Loss & Other Comprehensive Income | Statement of Cash Flows | Statement of Changes in Equity | Notes to Financial Statements | IFRS for SMEs | Financial Statement Disclosures",
    "tagline": "Financial Reporting. Regulatory Standards. Professional Precision.",
    "metaDescription": "Financial statements are more than a presentation of figures. They represent the financial position, performance and activities of a business through information prepared according to recognised accounting principles and applicable reporting requirements.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 11
  },
  {
    "icon": "bar-chart-3",
    "title": "05 — Management Accounting",
    "slug": "management-accounting",
    "description": "Management Accounts | Budgeting & Forecasting | Cost & Management Accounting | Variance Analysis | Profitability Analysis | Break-Even & Cost-Volume-Profit Analysis | Financial Performance Reviews | Cost Control & Monitoring | Financial Planning",
    "tagline": "Cost Intelligence. Performance Analysis. Financial Decision Support.",
    "metaDescription": "Revenue reveals the scale of a business. Profitability reveals the value it generates. Management accounting examines the financial relationships that determine the difference.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 12
  },
  {
    "icon": "lightbulb",
    "title": "06 — Business Advisory",
    "slug": "business-advisory",
    "description": "Business Financial Assessments | Financial Strategy & Planning | Business Performance Analysis | Investment Appraisals | Financial Risk Assessments | Business Planning | Resource Allocation Analysis | Financial Decision Support",
    "tagline": "Commercial Understanding. Financial Insight. Strategic Perspective.",
    "metaDescription": "A business decision is never just a decision. It is a commitment of capital, resources and financial capacity, made today in expectation of an outcome that has yet to be realised.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 13
  },
  {
    "icon": "building-2",
    "title": "07 — CIPC Services",
    "slug": "cipc-services",
    "description": "Company Registrations | CIPC Annual Returns | Company Amendments | Director Appointments & Resignations | Registered Office Address Changes | Company Information Updates | Beneficial Ownership Declarations & Filings",
    "tagline": "Corporate Registration. Statutory Administration. Regulatory Compliance.",
    "metaDescription": "A company does not become compliant simply because it has been registered. Registration establishes its legal existence. Maintaining that existence requires ongoing attention to statutory obligations, corporate records and the information disclosed to regulatory authorities.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 14
  },
  {
    "icon": "cloud",
    "title": "08 — Cloud Accounting (Xero)",
    "slug": "xero-accounting",
    "description": "Xero Setup & Implementation | Chart of Accounts Configuration | Opening & Conversion Balances | Accounting Data Migration | Bank Feed Integration | Bank Rules & Reconciliation Automation | Invoicing & Bills Management | Inventory Configuration | Financial Reporting | Xero Training & Support",
    "tagline": "Integrated Accounting Systems. Efficient Financial Processes.",
    "metaDescription": "Accounting software can automate transactions, organise financial records and generate reports. What it cannot do is determine whether the accounting principles, financial classifications and underlying information are correct.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 15
  },
  {
    "icon": "banknote",
    "title": "09 — Cash Flow Management",
    "slug": "cash-flow-management",
    "description": "Cash Flow Forecasting | Working Capital Analysis | Liquidity Assessments | Cash Flow Statements | Receivables & Payables Monitoring | Cash Flow Budgeting | Payment Planning | Cash Position Reviews",
    "tagline": "Liquidity Visibility. Working Capital Control. Financial Preparedness.",
    "metaDescription": "Profitability measures financial performance. Cash flow determines whether a business has the liquidity to meet its obligations when they fall due. The distinction between the two can determine whether a growing business remains financially sustainable.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 16
  },
  {
    "icon": "graduation-cap",
    "title": "10 — Accounting Training",
    "slug": "accounting-training",
    "description": "Financial Accounting | Management Accounting | Bookkeeping Fundamentals | Bank Reconciliations | General Ledger Accounting | Financial Statement Preparation & Interpretation | Accounting Software Training | Practical Accounting Workshops",
    "tagline": "Technical Knowledge. Practical Application. Financial Understanding.",
    "metaDescription": "Accounting competence is not measured by the ability to memorise procedures or produce financial figures. It is demonstrated through an understanding of accounting principles, the ability to apply them correctly and the judgement to recognise when financial information requires further examination.",
    "helpPoints": [],
    "relatedSlugs": [],
    "approvedSection": 17
  }
];

export const SERVICES_SECTION_HEADING = "Comprehensive Financial Solutions Under One Roof";
export const SERVICES_SECTION_INTRO = "Specialised Financial Disciplines. Clearly Defined Services. Professional Accountability.";
export const SERVICES_VIEW_ALL_LABEL = "View All Services";

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function servicePath(slug: string): string {
  return `/services/${slug}/`;
}

export function relatedServices(slug: string): ServiceItem[] {
  const current = getServiceBySlug(slug);
  if (!current) return [];
  return current.relatedSlugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is ServiceItem => Boolean(s));
}
