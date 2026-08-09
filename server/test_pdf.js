const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

const filePath = path.join(__dirname, '..', 'كتاب ترانيم العبادة.pdf');

async function testPdf() {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    console.log('File size:', dataBuffer.length, 'bytes');

    const data = await pdfParse(dataBuffer);
    
    console.log('Number of pages:', data.numpages);
    console.log('PDF Info:', data.info);
    
    const text = data.text;
    console.log('Extracted text length:', text.length, 'characters');
    
    if (text.length > 0) {
      console.log('First 500 characters of text:');
      console.log(text.substring(0, 500));
      console.log('---');
      console.log('Last 500 characters of text:');
      console.log(text.substring(text.length - 500));
    } else {
      console.log('No text was extracted! This is likely a scanned PDF containing only images.');
    }
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }
}

testPdf();
