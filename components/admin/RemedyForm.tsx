'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type {
  Remedy,
  RemedyBenefit,
  RemedyDosage,
  RemedyInteraction,
  RemedyFAQ,
  RemedyProduct,
} from '@/lib/remedies/types';

interface RemedyFormProps {
  initialData?: Remedy;
  mode: 'create' | 'edit';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Collapsible section wrapper
function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

// Reusable field components
function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {helper && <p className="text-xs text-gray-400 mb-1">{helper}</p>}
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
const textareaClass =
  'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[80px]';

// Tag/list input for simple string arrays
function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Add
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="hover:text-red-600"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function RemedyForm({ initialData, mode }: RemedyFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic fields
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [botanicalName, setBotanicalName] = useState(initialData?.botanicalName || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [overview, setOverview] = useState(initialData?.overview || '');
  const [howItWorks, setHowItWorks] = useState(initialData?.howItWorks || '');
  const [bestTimeToTake, setBestTimeToTake] = useState(initialData?.bestTimeToTake || '');
  const [howLongToWork, setHowLongToWork] = useState(initialData?.howLongToWork || '');

  // String arrays
  const [aliases, setAliases] = useState<string[]>(initialData?.aliases || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [sideEffects, setSideEffects] = useState<string[]>(initialData?.sideEffects || []);
  const [whoShouldAvoid, setWhoShouldAvoid] = useState<string[]>(initialData?.whoShouldAvoid || []);
  const [qualityMarkers, setQualityMarkers] = useState<string[]>(initialData?.qualityMarkers || []);
  const [relatedRemedies, setRelatedRemedies] = useState<string[]>(initialData?.relatedRemedies || []);
  const [oftenPairedWith, setOftenPairedWith] = useState<string[]>(initialData?.oftenPairedWith || []);

  // Complex arrays
  const [benefits, setBenefits] = useState<RemedyBenefit[]>(initialData?.benefits || []);
  const [dosages, setDosages] = useState<RemedyDosage[]>(initialData?.dosages || []);
  const [interactions, setInteractions] = useState<RemedyInteraction[]>(initialData?.interactions || []);
  const [faqs, setFaqs] = useState<RemedyFAQ[]>(initialData?.faqs || []);
  const [products, setProducts] = useState<RemedyProduct[]>(initialData?.products || []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (mode === 'create') {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = {
      name,
      slug,
      botanicalName,
      category,
      rating: Number(rating),
      summary,
      overview,
      howItWorks,
      bestTimeToTake,
      howLongToWork,
      aliases,
      tags,
      sideEffects,
      whoShouldAvoid,
      qualityMarkers,
      relatedRemedies,
      oftenPairedWith,
      benefits,
      dosages,
      interactions,
      faqs,
      products,
    };

    try {
      const url =
        mode === 'create'
          ? '/api/admin/remedies'
          : `/api/admin/remedies/${initialData?.slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push('/admin/remedies');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Helper to update an item in an array by index
  function updateAt<T>(arr: T[], index: number, patch: Partial<T>): T[] {
    return arr.map((item, i) => (i === index ? { ...item, ...patch } : item));
  }

  function removeAt<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Information - always open */}
      <Section title="Basic Information" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name">
            <input
              type="text"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Slug" helper={mode === 'create' ? 'Auto-generated from name' : 'Cannot be changed'}>
            <input
              type="text"
              value={slug}
              onChange={e => mode === 'create' && setSlug(e.target.value)}
              className={inputClass}
              required
              readOnly={mode === 'edit'}
            />
          </Field>
          <Field label="Botanical Name">
            <input
              type="text"
              value={botanicalName}
              onChange={e => setBotanicalName(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Adaptogen, Vitamin, Mineral"
              className={inputClass}
            />
          </Field>
          <Field label="Rating" helper="1.0 to 10.0">
            <input
              type="number"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              min={0}
              max={10}
              step={0.1}
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Summary" helper="Brief one-line description">
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Aliases">
          <TagInput value={aliases} onChange={setAliases} placeholder="Add an alias" />
        </Field>
        <Field label="Tags">
          <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />
        </Field>
      </Section>

      {/* Content */}
      <Section title="Content" defaultOpen>
        <Field label="Overview" helper="Detailed description of the remedy">
          <textarea
            value={overview}
            onChange={e => setOverview(e.target.value)}
            className={textareaClass}
            rows={4}
          />
        </Field>
        <Field label="How It Works" helper="Mechanism of action">
          <textarea
            value={howItWorks}
            onChange={e => setHowItWorks(e.target.value)}
            className={textareaClass}
            rows={4}
          />
        </Field>
      </Section>

      {/* Benefits */}
      <Section title={`Benefits (${benefits.length})`}>
        {benefits.map((b, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Benefit {i + 1}</span>
              <button
                type="button"
                onClick={() => setBenefits(removeAt(benefits, i))}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={b.name}
                onChange={e => setBenefits(updateAt(benefits, i, { name: e.target.value }))}
                placeholder="Benefit name"
                className={inputClass}
              />
              <input
                type="number"
                value={b.evidenceLevel}
                onChange={e =>
                  setBenefits(updateAt(benefits, i, { evidenceLevel: Number(e.target.value) }))
                }
                placeholder="Evidence level (1-5)"
                min={1}
                max={5}
                className={inputClass}
              />
            </div>
            <textarea
              value={b.description}
              onChange={e => setBenefits(updateAt(benefits, i, { description: e.target.value }))}
              placeholder="Description"
              className={textareaClass}
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setBenefits([...benefits, { name: '', description: '', evidenceLevel: 3 }])
          }
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Benefit
        </button>
      </Section>

      {/* Dosages */}
      <Section title={`Dosages (${dosages.length})`}>
        {dosages.map((d, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Dosage {i + 1}</span>
              <button
                type="button"
                onClick={() => setDosages(removeAt(dosages, i))}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={d.form}
                onChange={e => setDosages(updateAt(dosages, i, { form: e.target.value }))}
                placeholder="Form (e.g. Capsule)"
                className={inputClass}
              />
              <input
                type="text"
                value={d.amount}
                onChange={e => setDosages(updateAt(dosages, i, { amount: e.target.value }))}
                placeholder="Amount (e.g. 500mg)"
                className={inputClass}
              />
              <input
                type="text"
                value={d.timing}
                onChange={e => setDosages(updateAt(dosages, i, { timing: e.target.value }))}
                placeholder="Timing (e.g. Once daily)"
                className={inputClass}
              />
            </div>
            <input
              type="text"
              value={d.notes || ''}
              onChange={e => setDosages(updateAt(dosages, i, { notes: e.target.value }))}
              placeholder="Notes (optional)"
              className={inputClass}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setDosages([...dosages, { form: '', amount: '', timing: '' }])}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Dosage
        </button>
      </Section>

      {/* Timing */}
      <Section title="Timing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Best Time to Take">
            <input
              type="text"
              value={bestTimeToTake}
              onChange={e => setBestTimeToTake(e.target.value)}
              placeholder="e.g. Morning with food"
              className={inputClass}
            />
          </Field>
          <Field label="How Long to Work">
            <input
              type="text"
              value={howLongToWork}
              onChange={e => setHowLongToWork(e.target.value)}
              placeholder="e.g. 2-4 weeks"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* Safety */}
      <Section title="Safety Information">
        <Field label="Side Effects">
          <TagInput
            value={sideEffects}
            onChange={setSideEffects}
            placeholder="Add a side effect"
          />
        </Field>
        <Field label="Who Should Avoid">
          <TagInput
            value={whoShouldAvoid}
            onChange={setWhoShouldAvoid}
            placeholder="Add a group"
          />
        </Field>
      </Section>

      {/* Interactions */}
      <Section title={`Interactions (${interactions.length})`}>
        {interactions.map((inter, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Interaction {i + 1}</span>
              <button
                type="button"
                onClick={() => setInteractions(removeAt(interactions, i))}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={inter.substance}
                onChange={e =>
                  setInteractions(updateAt(interactions, i, { substance: e.target.value }))
                }
                placeholder="Substance"
                className={inputClass}
              />
              <select
                value={inter.severity}
                onChange={e =>
                  setInteractions(
                    updateAt(interactions, i, {
                      severity: e.target.value as 'mild' | 'moderate' | 'severe',
                    })
                  )
                }
                className={inputClass}
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <textarea
              value={inter.description}
              onChange={e =>
                setInteractions(updateAt(interactions, i, { description: e.target.value }))
              }
              placeholder="Description of interaction"
              className={textareaClass}
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setInteractions([
              ...interactions,
              { substance: '', severity: 'mild', description: '' },
            ])
          }
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Interaction
        </button>
      </Section>

      {/* FAQs */}
      <Section title={`FAQs (${faqs.length})`}>
        {faqs.map((faq, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">FAQ {i + 1}</span>
              <button
                type="button"
                onClick={() => setFaqs(removeAt(faqs, i))}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={faq.question}
              onChange={e => setFaqs(updateAt(faqs, i, { question: e.target.value }))}
              placeholder="Question"
              className={inputClass}
            />
            <textarea
              value={faq.answer}
              onChange={e => setFaqs(updateAt(faqs, i, { answer: e.target.value }))}
              placeholder="Answer"
              className={textareaClass}
              rows={2}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </Section>

      {/* Quality & Products */}
      <Section title="Quality & Products">
        <Field label="Quality Markers">
          <TagInput
            value={qualityMarkers}
            onChange={setQualityMarkers}
            placeholder="Add a quality marker"
          />
        </Field>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Products ({products.length})
          </h4>
          {products.map((p, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Product {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setProducts(removeAt(products, i))}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={p.name}
                  onChange={e => setProducts(updateAt(products, i, { name: e.target.value }))}
                  placeholder="Product name"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={p.brand}
                  onChange={e => setProducts(updateAt(products, i, { brand: e.target.value }))}
                  placeholder="Brand"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={p.form}
                  onChange={e => setProducts(updateAt(products, i, { form: e.target.value }))}
                  placeholder="Form (e.g. Capsule)"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={p.size}
                  onChange={e => setProducts(updateAt(products, i, { size: e.target.value }))}
                  placeholder="Size (e.g. 60 caps)"
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                value={p.affiliateUrl}
                onChange={e =>
                  setProducts(updateAt(products, i, { affiliateUrl: e.target.value }))
                }
                placeholder="Affiliate URL"
                className={inputClass}
              />
              <input
                type="text"
                value={p.note || ''}
                onChange={e => setProducts(updateAt(products, i, { note: e.target.value }))}
                placeholder="Note (optional)"
                className={inputClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProducts([
                ...products,
                { name: '', brand: '', form: '', size: '', affiliateUrl: '' },
              ])
            }
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </Section>

      {/* Related */}
      <Section title="Related Remedies">
        <Field label="Related Remedies" helper="Slugs of related remedies">
          <TagInput
            value={relatedRemedies}
            onChange={setRelatedRemedies}
            placeholder="Add a remedy slug"
          />
        </Field>
        <Field label="Often Paired With" helper="Slugs of remedies often used together">
          <TagInput
            value={oftenPairedWith}
            onChange={setOftenPairedWith}
            placeholder="Add a remedy slug"
          />
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/admin/remedies"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Remedies
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : mode === 'create' ? 'Create Remedy' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
