import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateData {
  marriageId?: string;
  tokenId?: string;
  spouseAName: string;
  spouseBName: string;
  weddingDate: string;
  location: string;
  vows: string;
  officiant?: string;
  mintedAt?: string;
  blockchainTx?: string;
  id?: string; // For the standalone certificate page
}

export async function generateCertificatePDF(
  certificate: CertificateData,
  elementId: string = 'certificate-content'
): Promise<void> {
  try {
    // Find the certificate element to capture
    const element = document.getElementById(elementId) || document.querySelector('.certificate-content');
    
    if (!element) {
      throw new Error('Certificate element not found for PDF generation');
    }

    // Configure html2canvas options for better quality
    const canvas = await html2canvas(element as HTMLElement, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Calculate dimensions for PDF (A4 format)
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate scaling to fit the content while maintaining aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
    
    const scaledWidth = imgWidth * 0.264583 * ratio;
    const scaledHeight = imgHeight * 0.264583 * ratio;
    
    // Center the image on the page
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    // Generate filename
    const filename = `Marriage-Certificate-${certificate.spouseAName}-${certificate.spouseBName}.pdf`
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    
    // Save the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

export async function generateCertificatePDFFromHTML(
  certificate: CertificateData
): Promise<void> {
  try {
    // Create a temporary container for the certificate
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '40px';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Generate the certificate HTML
    container.innerHTML = `
      <div style="border: 4px solid #fda4af; border-radius: 16px; padding: 32px; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);">
        <!-- Certificate Title -->
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px;">
            <div style="width: 24px; height: 24px; color: #f43f5e;">💖</div>
            <h2 style="font-size: 24px; font-weight: bold; color: #374151; margin: 0;">Certificate of Marriage</h2>
            <div style="width: 24px; height: 24px; color: #f43f5e;">💖</div>
          </div>
          <div style="width: 96px; height: 4px; background: linear-gradient(90deg, #fb7185 0%, #ec4899 100%); margin: 0 auto;"></div>
        </div>

        <!-- Couple Names -->
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="font-size: 18px; color: #6b7280; margin-bottom: 8px;">This certifies that</p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 16px;">
            <h3 style="font-size: 32px; font-weight: bold; color: #374151; margin: 0;">${certificate.spouseAName}</h3>
            <div style="width: 32px; height: 32px; color: #f43f5e;">💖</div>
            <h3 style="font-size: 32px; font-weight: bold; color: #374151; margin: 0;">${certificate.spouseBName}</h3>
          </div>
          <p style="font-size: 18px; color: #6b7280; margin: 0;">were united in marriage</p>
        </div>

        <!-- Wedding Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
          <div style="background: rgba(255,255,255,0.6); border-radius: 12px; padding: 24px; border: 1px solid #fda4af;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="width: 20px; height: 20px; color: #f43f5e;">📅</div>
              <h4 style="font-weight: 600; color: #374151; margin: 0;">Wedding Date</h4>
            </div>
            <p style="color: #6b7280; margin: 0;">${new Date(certificate.weddingDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>

          <div style="background: rgba(255,255,255,0.6); border-radius: 12px; padding: 24px; border: 1px solid #fda4af;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="width: 20px; height: 20px; color: #f43f5e;">📍</div>
              <h4 style="font-weight: 600; color: #374151; margin: 0;">Location</h4>
            </div>
            <p style="color: #6b7280; margin: 0;">${certificate.location}</p>
          </div>
        </div>

        <!-- Vows Section -->
        <div style="background: rgba(255,255,255,0.6); border-radius: 12px; padding: 24px; border: 1px solid #fda4af; margin-bottom: 32px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="width: 20px; height: 20px; color: #f43f5e;">💬</div>
            <h4 style="font-weight: 600; color: #374151; margin: 0;">Wedding Vows</h4>
          </div>
          <p style="color: #6b7280; font-style: italic; line-height: 1.6; margin: 0;">"${certificate.vows}"</p>
        </div>

        ${certificate.officiant ? `
        <div style="text-align: center; margin-bottom: 32px;">
          <p style="color: #6b7280; margin-bottom: 4px;">Officiated by</p>
          <p style="font-size: 18px; font-weight: 600; color: #374151; margin: 0;">${certificate.officiant}</p>
        </div>
        ` : ''}

        <!-- Blockchain Details -->
        ${(certificate.marriageId || certificate.tokenId || certificate.id) ? `
        <div style="background: rgba(255,255,255,0.8); border-radius: 12px; padding: 24px; border: 2px solid #fda4af; margin-bottom: 32px;">
          <h4 style="font-weight: 600; color: #374151; margin-bottom: 16px; text-align: center;">Blockchain Authentication</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 14px;">
            ${certificate.marriageId ? `
            <div>
              <p style="color: #6b7280; font-weight: 500; margin: 0 0 4px 0;">Marriage ID</p>
              <p style="font-family: monospace; color: #374151; margin: 0;">${certificate.marriageId}</p>
            </div>
            ` : ''}
            <div>
              <p style="color: #6b7280; font-weight: 500; margin: 0 0 4px 0;">Token ID</p>
              <p style="font-family: monospace; color: #374151; margin: 0;">${certificate.tokenId || certificate.id}</p>
            </div>
            ${certificate.mintedAt ? `
            <div>
              <p style="color: #6b7280; font-weight: 500; margin: 0 0 4px 0;">Minted</p>
              <p style="color: #374151; margin: 0;">${new Date(certificate.mintedAt).toLocaleDateString()}</p>
            </div>
            ` : ''}
          </div>
        </div>
        ` : ''}

        <!-- Certificate Footer -->
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p style="margin: 0 0 4px 0;">This marriage certificate is permanently recorded on the Flow blockchain</p>
          <p style="margin: 0;">and represents a legally recognized union in the digital realm.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    // Generate PDF from the temporary element
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: container.scrollHeight,
    });
    
    document.body.removeChild(container);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
    
    const scaledWidth = imgWidth * 0.264583 * ratio;
    const scaledHeight = imgHeight * 0.264583 * ratio;
    
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    const filename = `Marriage-Certificate-${certificate.spouseAName}-${certificate.spouseBName}.pdf`
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .replace(/-+/g, '-');
    
    pdf.save(filename);
    
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}
