const YOUCAM_API_KEY = "sk-UdnNg61P6ppi83WAB6w8roH3y5Vnwt0zo-hl5uHDm7PLpBW2T3ponEnVIWwx_QHO";
const API_BASE = "https://yce-api-01.makeupar.com";

async function test() {
  // 1. Get file upload url
  const fileRes = await fetch(`${API_BASE}/s2s/v2.0/file/image-to-image/youcam`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUCAM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: [{
        content_type: "image/jpeg",
        file_name: "test.jpg",
        file_size: 100 // dummy size
      }]
    })
  });
  
  const fileJson = await fileRes.json();
  console.log("File Upload Res:", fileJson.data.files[0]);
}

test();
