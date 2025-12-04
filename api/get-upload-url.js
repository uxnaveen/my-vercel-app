import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { fileName, bucketName } = req.body;

  if (!fileName || !bucketName) {
    return res.status(400).json({ error: 'fileName and bucketName are required' });
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUploadUrl(fileName, 120);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({
    uploadUrl: data.signedUrl,
    path: data.path
  });
}
