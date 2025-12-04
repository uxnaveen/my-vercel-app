// /api/submit.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const p = req.body;

  // minimal server-side validation
  const required = ['startup_name','authorized_person_name','contact_number','nature_of_entity','stage','has_dpiit_certificate','brief_about_startup','title_of_innovation','description_of_innovation','district','pincode'];
  for (const k of required) {
    if (p[k] === undefined || p[k] === null || String(p[k]).trim() === '') {
      return res.status(400).json({ error: `Missing required field: ${k}` });
    }
  }

  const insert = {
    startup_name: p.startup_name,
    authorized_person_name: p.authorized_person_name,
    contact_number: p.contact_number,
    nature_of_entity: p.nature_of_entity,
    stage: p.stage,
    has_dpiit_certificate: !!p.has_dpiit_certificate,
    brief_about_startup: p.brief_about_startup,
    title_of_innovation: p.title_of_innovation,
    description_of_innovation: p.description_of_innovation,
    district: p.district,
    pincode: p.pincode,
    attachments: p.attachments || []
  };

  const { data, error } = await supabase.from('applications').insert([insert]).select();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, application: data[0] });
}
