import PDFKit from 'pdfkit';
import fs from 'fs';

const fontPath = {
  normal: './fonts/THSarabunNew.ttf',
  bold: './fonts/THSarabunNewBold.ttf',
  italic: './fonts/THSarabunNewItalic.ttf',
};

const generatePDF = (data) => {
  const doc = new PDFKit({
    size: 'A4',
    layout: 'landscape',
  });

  doc.font(fontPath.bold).fontSize(20);

  doc.text('บันทึก การเข้าร่วมโครงการ/กิจกรรม ทีทำประโยชน์ต่อสังคมหรือสาธารณะ ภาคเรียนที่......... ปีการศึกษา.........', {
    align: 'center',
  });

  doc.rect(30, 120, 120, 80).stroke();

  doc.rect(150, 120, 120, 80).stroke();
  doc.rect(270, 120, 90, 80).stroke();
  doc.rect(360, 120, 55, 80).stroke();
  doc.rect(415, 120, 80, 80).stroke();
  doc.rect(495, 120, 100, 80).stroke();
  doc.rect(595, 120, 100, 80).stroke();
  doc.rect(695, 120, 100, 80).stroke();

  doc.fontSize(14);
  doc.text('    ชื่อโครงการ / กิจกรรม \n ที่ทำประโยชน์ต่อสังคมหรือ สาธารณะ', 30, 128, {
    width: 120,
    height: 80,
    align: 'center',
  });

  doc.text('สถานที่\nดำเนินโครงการ /กิจกรรม', 150, 128, {
    width: 120,
    height: 80,
    align: 'center',
  });

  doc.text('วัน/เดือน/ปี', 270, 128, {
    width: 90,
    height: 80,
    align: 'center',
  });

  doc.text('เวลา', 360, 128, {
    width: 55,
    height: 80,
    align: 'center',
  });

  doc.text('  จำนวนชั่วโมง\n(รวม)/วัน', 415, 128, {
    width: 80,
    height: 80,
    align: 'center',
  });

  doc.text('ลักษณะของกิจกรรม (โดยละเอียด) ', 495, 128, {
    width: 100,
    height: 80,
    align: 'center',
  });

  doc.text('ลายมือชื่อผู้รับรอง (หัวหน้าหน่วยงานหรือ  ผู้ที่ได้รับมอบหมาย) ', 595, 128, {
    width: 100,
    height: 80,
    align: 'center',
  });

  doc.text('ลายมือชื่อผู้รับรอง\n (ผู้บริหารสถานศึกษา หรือผู้ที่ได้รับมอบหมาย) ', 695, 128, {
    width: 100,
    height: 80,
    align: 'center',
  });

  let rowY = 200;
  let textY = 208;

  for (let index = 0; index < 4; index += 1) {
    doc.rect(30, rowY, 120, 80).stroke();
    doc.rect(150, rowY, 120, 80).stroke();
    doc.rect(270, rowY, 90, 80).stroke();
    doc.rect(360, rowY, 55, 80).stroke();
    doc.rect(415, rowY, 80, 80).stroke();
    doc.rect(495, rowY, 100, 80).stroke();
    doc.rect(595, rowY, 100, 80).stroke();
    doc.rect(695, rowY, 100, 80).stroke();

    rowY += 80;
  }

  for (let index = 0; index < data.length; index += 1) {
    doc.text(data[index].activityName, 30, textY, {
      width: 120,
      height: 80,
      align: 'center',
    });

    doc.text(data[index].location, 150, textY, {
      width: 120,
      height: 80,
      align: 'center',
    });

    doc.text(new Date(data[index].date).toLocaleDateString('th', { dateStyle: 'medium' }), 270, textY, {
      width: 90,
      height: 80,
      align: 'center',
    });

    doc.text(data[index].time, 360, textY, {
      width: 55,
      height: 80,
      align: 'center',
    });

    doc.text(data[index].hourGain, 415, textY, {
      width: 80,
      height: 80,
      align: 'center',
    });

    doc.text(data[index].updateStatusBy, 595, textY, {
      width: 100,
      height: 80,
      align: 'center',
    });
    textY += 80;
  }

  doc.end();
  return doc;
};

export default generatePDF;
