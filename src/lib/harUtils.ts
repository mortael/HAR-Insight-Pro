import { HAREntry, CodeExportType } from '../types';

export const parseHar = (jsonString: string): HAREntry[] => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.log || !Array.isArray(data.log.entries)) {
      throw new Error('Invalid HAR format: missing log.entries');
    }
    return data.log.entries.map((entry: any, index: number) => ({
      ...entry,
      _id: crypto.randomUUID?.() || `entry-${index}-${Date.now()}`,
    }));
  } catch (e) {
    console.error('Failed to parse HAR', e);
    throw e;
  }
};

export const sanitizeEntry = (entry: HAREntry, customHeaders: string[] = [], customPatterns: string[] = []): HAREntry => {
  const sensitiveHeaders = [
    'authorization', 'cookie', 'set-cookie', 'x-api-key', 'proxy-authorization',
    ...customHeaders.map(h => h.toLowerCase())
  ];
  
  const patterns = customPatterns.map(p => {
    try {
      return new RegExp(p, 'gi');
    } catch (e) {
      return null;
    }
  }).filter((p): p is RegExp => p !== null);

  const sanitizeValue = (value: string) => {
    let sanitized = value;
    patterns.forEach(p => {
      sanitized = sanitized.replace(p, '[REDACTED]');
    });
    return sanitized;
  };

  const sanitizeHeaders = (headers: { name: string; value: string }[]) => 
    headers.map(h => {
      if (sensitiveHeaders.includes(h.name.toLowerCase())) {
        return { ...h, value: '[REDACTED]' };
      }
      return { ...h, value: sanitizeValue(h.value) };
    });

  const sanitizeCookies = (cookies: any[]) => 
    cookies.map(c => ({ ...c, value: '[REDACTED]' }));

  const sanitizedEntry = {
    ...entry,
    request: {
      ...entry.request,
      headers: sanitizeHeaders(entry.request.headers),
      cookies: sanitizeCookies(entry.request.cookies),
    },
    response: {
      ...entry.response,
      headers: sanitizeHeaders(entry.response.headers),
      cookies: sanitizeCookies(entry.response.cookies),
    }
  };

  // Also sanitize postData if present
  if (sanitizedEntry.request.postData?.text) {
    sanitizedEntry.request.postData.text = sanitizeValue(sanitizedEntry.request.postData.text);
  }

  return sanitizedEntry;
};

export const formatSize = (bytes: number): string => {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const res = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return (isNaN(res) ? '0' : res) + ' ' + (sizes[i] || 'B');
};

export const convertToCode = (entry: HAREntry, type: CodeExportType): string => {
  const { request } = entry;
  
  if (type === 'curl') {
    let curl = `curl -X ${request.method} '${request.url}'`;
    request.headers.forEach(h => {
      curl += ` \\\n  -H '${h.name}: ${h.value}'`;
    });
    if (request.postData?.text) {
      curl += ` \\\n  --data-raw '${request.postData.text.replace(/'/g, "'\\''")}'`;
    }
    return curl;
  }

  if (type === 'python') {
    let python = `import requests\n\n`;
    python += `url = "${request.url}"\n\n`;
    
    python += `headers = {\n`;
    request.headers.forEach(h => {
      python += `    "${h.name}": "${h.value.replace(/"/g, '\\"')}",\n`;
    });
    python += `}\n\n`;

    if (request.postData?.text) {
      python += `data = """${request.postData.text.replace(/"""/g, '\\"\\"\\"')}"""\n\n`;
      python += `response = requests.${request.method.toLowerCase()}(url, headers=headers, data=data)\n`;
    } else {
      python += `response = requests.${request.method.toLowerCase()}(url, headers=headers)\n`;
    }
    
    python += `print(response.status_code)\n`;
    python += `print(response.text)\n`;
    return python;
  }

  if (type === 'powershell') {
    let ps = `$headers = @{\n`;
    request.headers.forEach(h => {
      ps += `    "${h.name}" = "${h.value.replace(/"/g, '`"')}"\n`;
    });
    ps += `}\n\n`;

    ps += `Invoke-RestMethod -Uri "${request.url}" \`
    -Method "${request.method}" \`
    -Headers $headers`;

    if (request.postData?.text) {
      ps += ` \`
    -Body '${request.postData.text.replace(/'/g, "''")}'`;
    }
    
    return ps;
  }

  return '';
};
