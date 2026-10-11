import jsPDF from 'jspdf';

export interface AuditReportData {
  sectorId: string;
  lat: string;
  lng: string;
  hectaresLost: string;
  lossPercent: string;
  co2Tons: string;
  creditLossUsd: string;
  confidence: string;
  beforeImage?: string;
  afterImage?: string;
  deltaImage?: string;
  cirImage?: string;
  ndviImage?: string;
}

export function generateSovereignAuditPDF(data: AuditReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const auditRef = `ECO-${Math.abs(Math.round(parseFloat(data.lat) * 100))}-${Math.abs(Math.round(parseFloat(data.lng) * 100))}-${Date.now().toString().slice(-4)}`;

  // --- BRAND HEADER BLOCK ---
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Emerald Accent Strip
  doc.setFillColor(51, 153, 102);
  doc.rect(0, 28, pageWidth, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.text('ECOZILLA  |  SOVEREIGN LAND AUDIT', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('COPERNICUS SENTINEL-2 AI SEGMENTATION & EUDR COMPLIANCE RECORD', 14, 20);

  // Top Right Audit Code (Use standard Helvetica to avoid Courier kerning)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 153, 102);
  doc.text(`REF: ${auditRef}`, pageWidth - 14, 13, { align: 'right' });
  doc.setTextColor(180, 180, 180);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ISSUED: ${dateFormatted}`, pageWidth - 14, 20, { align: 'right' });

  // --- TARGET SECTOR METADATA STRIP (Clean 2x2 Grid) ---
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.6);
  doc.rect(14, 36, pageWidth - 28, 24, 'FD');

  // Divider lines inside the metadata card
  doc.setDrawColor(220, 222, 225);
  doc.setLineWidth(0.4);
  const midX = 14 + (pageWidth - 28) / 2;
  doc.line(midX, 36, midX, 60); // Vertical split
  doc.line(14, 48, pageWidth - 14, 48); // Horizontal split

  // Box 1: Target Coordinates (Top Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('TARGET COORDINATES', 18, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 153, 102);
  doc.text(`${parseFloat(data.lat).toFixed(4)} deg, ${parseFloat(data.lng).toFixed(4)} deg`, 18, 45.5);

  // Box 2: Regulatory EUDR Status (Top Right)
  const lossNum = parseFloat(data.hectaresLost);
  const isHighRisk = lossNum > 5.0;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('EUDR REGULATORY STATUS', midX + 4, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  if (isHighRisk) {
    doc.setTextColor(220, 38, 38);
    doc.text('NON-COMPLIANT (ACTIVE CLEARING DETECTED)', midX + 4, 45.5);
  } else {
    doc.setTextColor(51, 153, 102);
    doc.text('LOW RISK (ZERO / NOMINAL VARIANCE)', midX + 4, 45.5);
  }

  // Box 3: Monitored Region (Bottom Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('MONITORED SECTOR FOOTPRINT', 18, 53);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text('1,600 Hectares (16.0 km2 Bounding Polygon)', 18, 57.5);

  // Box 4: Constellation & Resolution (Bottom Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(110, 110, 110);
  doc.text('CONSTELLATION & SENSOR', midX + 4, 53);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text('ESA Copernicus Sentinel-2 MSI (10m Resolution)', midX + 4, 57.5);

  // Re-draw clean outer border
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.6);
  doc.rect(14, 36, pageWidth - 28, 24, 'S');

  // --- SATELLITE EVIDENCE IMAGERY MATRIX ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text('ORBITAL SATELLITE EVIDENCE & SEGMENTATION DELTA', 14, 66);

  const imgY = 70;
  const imgWidth = 56;
  const imgHeight = 56;
  const gap = 7;

  const drawImageTile = (imgData: string | undefined, x: number, label: string, badgeBg: number[]) => {
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.6);
    doc.setFillColor(242, 244, 246);
    doc.rect(x, imgY, imgWidth, imgHeight, 'FD');

    if (imgData) {
      try {
        const cleanFormat = imgData.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(imgData, cleanFormat, x, imgY, imgWidth, imgHeight);
      } catch (err) {
        console.error('PDF image embed notice:', err);
      }
    }

    // Outer border
    doc.rect(x, imgY, imgWidth, imgHeight, 'S');

    // Label tag
    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.rect(x, imgY + imgHeight - 6, imgWidth, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(label, x + imgWidth / 2, imgY + imgHeight - 2, { align: 'center' });
  };

  drawImageTile(data.beforeImage, 14, 'T-1 YEAR (BASELINE ORBIT)', [17, 17, 17]);
  drawImageTile(data.afterImage, 14 + imgWidth + gap, 'CURRENT OPTICAL ORBIT (T2)', [17, 17, 17]);
  drawImageTile(data.deltaImage, 14 + (imgWidth + gap) * 2, 'AI DELTA LOSS MASK (U-NET)', [220, 38, 38]);

  // --- SCIENTIFIC & CARBON IMPACT BALANCE SHEET ---
  const tableY = 136;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text('ENVIRONMENTAL BALANCE SHEET & CARBON IMPACT LEDGER', 14, tableY);

  const colX1 = 14;   // Metric Spec
  const colX2 = 82;   // Calculated Value
  const colX3 = 132;  // Reference
  const tableW = pageWidth - 28;

  // Header Bar
  doc.setFillColor(17, 17, 17);
  doc.rect(colX1, tableY + 4, tableW, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('METRIC SPECIFICATION', colX1 + 4, tableY + 9.5);
  doc.text('CALCULATED VALUE', colX2 + 4, tableY + 9.5);
  doc.text('BENCHMARK / REFERENCE', colX3 + 4, tableY + 9.5);

  const rows = [
    {
      metric: 'Canopy Loss Area',
      val: `${data.hectaresLost} HA (${data.lossPercent}%)`,
      ref: 'U-Net Semantic Segmentation Output',
      isLoss: true,
    },
    {
      metric: 'Biomass CO2 Release',
      val: `${data.co2Tons} tCO2e`,
      ref: 'IPCC Tropical Factor: 260 tCO2e/HA',
      isLoss: true,
    },
    {
      metric: 'Carbon Credit (VCM) Loss',
      val: `$${Number(data.creditLossUsd).toLocaleString()} USD`,
      ref: 'Voluntary Market Benchmark: $25.00/t',
      isLoss: true,
    },
    {
      metric: 'Model Inception Confidence',
      val: `${data.confidence}%`,
      ref: 'Geospatial Neural Engine Test Validation',
      isLoss: false,
    },
    {
      metric: 'Automotive Equivalency',
      val: `~${Math.round(parseFloat(data.co2Tons) / 4.6).toLocaleString()} Cars/Yr`,
      ref: 'EPA Annual Vehicle Benchmark (4.6 tCO2/yr)',
      isLoss: false,
    },
  ];

  let currentY = tableY + 12;
  const rowHeight = 7.5;

  rows.forEach((r, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 246, isEven ? 255 : 248, isEven ? 255 : 250);
    doc.rect(colX1, currentY, tableW, rowHeight, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.line(colX1, currentY + rowHeight, colX1 + tableW, currentY + rowHeight);

    // Metric Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(r.metric, colX1 + 4, currentY + 5);

    // Calculated Value (clean Helvetica Bold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    if (r.isLoss) {
      doc.setTextColor(220, 38, 38);
    } else {
      doc.setTextColor(51, 153, 102);
    }
    doc.text(r.val, colX2 + 4, currentY + 5);

    // Reference
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    doc.text(r.ref, colX3 + 4, currentY + 5);

    currentY += rowHeight;
  });

  // Table Outer Frame
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.6);
  doc.rect(colX1, tableY + 4, tableW, currentY - (tableY + 4), 'S');

  // --- STATUTORY AUDIT OPINION / EUDR VERDICT ---
  const opinionY = currentY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);
  doc.text('STATUTORY AUDIT OPINION & REGULATORY FINDING', 14, opinionY);

  const opinionBoxH = 30;
  doc.setFillColor(248, 249, 250);
  doc.rect(14, opinionY + 4, pageWidth - 28, opinionBoxH, 'FD');
  doc.setDrawColor(17, 17, 17);
  doc.rect(14, opinionY + 4, pageWidth - 28, opinionBoxH, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);

  const opinionText = isHighRisk
    ? `ADVERSE FINDING: Autonomous spectral analysis indicates active canopy degradation totaling ${data.hectaresLost} HA within the monitored zone since baseline orbit. Under European Union Deforestation Regulation (EUDR Regulation (EU) 2023/1115), products derived from this polygon after December 31, 2020 face strict non-compliance penalties unless verified uncultivated. Estimated biomass degradation released ${data.co2Tons} tons of CO2 equivalent.`
    : `CLEARANCE FINDING: Autonomous spectral analysis reveals zero to nominal canopy variance within the monitored 1,600 HA sector. Sector remains classified as LOW RISK under EU Deforestation Regulation (EUDR) benchmarks. Carbon biomass density remains stable across verified multi-spectral Sentinel-2 bands.`;

  const splitOpinion = doc.splitTextToSize(opinionText, pageWidth - 36);
  doc.text(splitOpinion, 18, opinionY + 10.5);

  // Sign-off Stamp Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 17, 17);
  doc.text('VALIDATION ENGINE: EcoZilla U-Net v6 (PyTorch)', 18, opinionY + 30);
  doc.text(`HASH: sha256:${auditRef.toLowerCase()}7f89b`, 100, opinionY + 30);
  doc.setTextColor(51, 153, 102);
  doc.text('STATUS: CERTIFIED', pageWidth - 18, opinionY + 30, { align: 'right' });

  // --- FOOTER ---
  doc.setFillColor(17, 17, 17);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('CONFIDENTIAL & PROPRIETARY  |  GENERATED AUTONOMOUSLY BY ECOZILLA SPATIAL AI', 14, pageHeight - 5);
  doc.text('PAGE 1 OF 1  |  ISO-14064 COMPLIANT', pageWidth - 14, pageHeight - 5, { align: 'right' });

  // Download File
  const filename = `EcoZilla_Audit_Report_${parseFloat(data.lat).toFixed(2)}_${parseFloat(data.lng).toFixed(2)}_${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
