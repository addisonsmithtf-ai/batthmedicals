import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { backupText } = await req.json();

    // Find the policies COPY block
    const copyStart = backupText.indexOf('COPY public.policies (id, title, description, category, status, version, content, created_by, created_at, updated_at) FROM stdin;');
    if (copyStart === -1) {
      return new Response(JSON.stringify({ error: 'Could not find policies COPY block' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get everything after the COPY line
    const afterCopy = backupText.substring(copyStart);
    const dataStart = afterCopy.indexOf('\n') + 1;
    const dataEnd = afterCopy.indexOf('\n\\.\n');
    
    if (dataEnd === -1) {
      return new Response(JSON.stringify({ error: 'Could not find end of COPY block' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dataBlock = afterCopy.substring(dataStart, dataEnd);
    const lines = dataBlock.split('\n').filter(l => l.trim() !== '');

    const results = [];
    for (const line of lines) {
      // Split by actual tabs
      const fields = line.split('\t');
      if (fields.length < 10) {
        results.push({ error: `Not enough fields: ${fields.length}`, preview: line.substring(0, 50) });
        continue;
      }

      // Unescape COPY format
      const unescape = (s: string) => {
        if (!s || s === '\\N') return null;
        return s
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/\\\\/g, '\\');
      };

      const policy = {
        id: fields[0],
        title: unescape(fields[1])?.trim(),
        description: unescape(fields[2])?.trim(),
        category: unescape(fields[3])?.trim(),
        status: unescape(fields[4])?.trim(),
        version: unescape(fields[5])?.trim(),
        content: unescape(fields[6]),
        created_by: fields[7] === '\\N' ? null : fields[7],
        created_at: fields[8],
        updated_at: fields[9],
      };

      const { error } = await supabase
        .from('policies')
        .upsert(policy, { onConflict: 'id' });

      if (error) {
        results.push({ error: error.message, title: policy.title });
      } else {
        results.push({ success: true, title: policy.title });
      }
    }

    return new Response(JSON.stringify({ count: lines.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
