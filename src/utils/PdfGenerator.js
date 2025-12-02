// utils/PdfGenerator.js
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Función para sanitizar texto
const safe = (text) => {
  return text ? String(text) : "";
};

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return dateString;
  }
};

// Función para generar el HTML EXACTO de la imagen
const generarHTMLReceta = (receta, logoUri) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #333;
            background: white;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 4px solid #0077B6;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo {
            width: 90px;
            height: 90px;
            border: 2px solid #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            flex-shrink: 0;
          }
          .logo img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
          .doctor-info h1 {
            font-size: 20px;
            color: #0077B6;
            margin: 0 0 5px 0;
            font-weight: bold;
          }
          .doctor-info div {
            font-size: 13px;
            color: #333;
            margin: 3px 0;
          }
          .header-right {
            text-align: right;
            font-size: 12px;
            color: #333;
          }
          .section-title {
            font-size: 16px;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #0077B6;
            font-weight: bold;
          }
          .data-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 10px;
          }
          .field {
            font-size: 12px;
            color: #333;
          }
          .field strong {
            color: #000;
            font-weight: bold;
          }
          .rx-symbol {
            font-size: 80px;
            color: #0077B6;
            margin: 30px 0;
            text-align: left;
            font-weight: bold;
            line-height: 1;
          }
          .box {
            background: #F9FBFC;
            padding: 20px;
            border-left: 5px solid #0077B6;
            margin-top: 10px;
            white-space: pre-wrap;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
            min-height: 80px;
          }
          .footer {
            margin-top: 50px;
            padding: 20px;
            background: white;
            color: #999;
            text-align: center;
            font-size: 12px;
          }
          .footer strong {
            color: #999;
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <div class="logo">
              ${logoUri ? `<img src="${logoUri}" />` : '❓'}
            </div>
            <div class="doctor-info">
              <h1>${safe(receta.nombreMedico)}</h1>
              <div>Médico General</div>
              <div>Cédula: ${safe(receta.matricula)}</div>
            </div>
          </div>
          <div class="header-right">
            Tel: ${safe(receta.telefonoMedico)}<br>
            Email: ${safe(receta.emailMedico)}
          </div>
        </div>

        <div class="section-title">Datos del Paciente</div>
        <div class="data-grid">
          <div class="field"><strong>Paciente:</strong> ${safe(receta.nombrePaciente)}</div>
          <div class="field"><strong>Edad:</strong> ${safe(receta.edad)}</div>
          <div class="field"><strong>Fecha Nac.:</strong> ${formatDate(receta.fechaNacimiento)}</div>
          <div class="field"><strong>Teléfono:</strong> ${safe(receta.telefonoPaciente)}</div>
          <div class="field"><strong>Fecha de Receta:</strong> ${formatDate(receta.fechaReceta)}</div>
        </div>
        <div class="field" style="margin-top: 5px;"><strong>Alergias/Diagnóstico:</strong> ${safe(receta.alergias)}</div>

        <div class="section-title">Signos Vitales</div>
        <div class="data-grid">
          <div class="field"><strong>Temperatura:</strong> ${safe(receta.temp)}°C</div>
          <div class="field"><strong>Presión:</strong> ${safe(receta.presion)}</div>
          <div class="field"><strong>Estatura:</strong> ${safe(receta.estatura)} cm</div>
          <div class="field"></div>
        </div>

        <div class="rx-symbol">Rx</div>

        <div class="section-title">Tratamiento</div>
        <div class="box">${safe(receta.tratamiento)}</div>

        <div class="footer">
          <strong>${safe(receta.nombreMedico)}</strong>
          <div>Tel: ${safe(receta.telefonoMedico)} — Email: ${safe(receta.emailMedico)}</div>
        </div>
      </body>
    </html>
  `;
};

// Función principal para generar el PDF con html2canvas
export const generarRecetaPDF = async (formData, returnType = 'blob', logoUri = '') => {
  console.log("📄 Generando PDF...");

  return new Promise(async (resolve, reject) => {
    try {
      const elemento = document.createElement("div");
      elemento.style.width = "794px";
      elemento.style.minHeight = "1123px";
      elemento.style.padding = "0";
      elemento.style.position = "absolute";
      elemento.style.left = "-9999px";
      elemento.style.background = "white";

      const receta = {
        nombreMedico: formData.doctorNombre,
        matricula: formData.doctorCedula,
        telefonoMedico: formData.doctorTelefono,
        emailMedico: formData.doctorEmail,
        nombrePaciente: formData.pacienteNombre,
        edad: formData.pacienteEdad,
        fechaNacimiento: formData.pacienteNacimiento,
        telefonoPaciente: formData.pacienteTelefono,
        alergias: formData.pacienteAlergias,
        fechaReceta: new Date().toISOString(),
        temp: formData.temperatura,
        presion: formData.presion,
        estatura: formData.estatura,
        tratamiento: formData.tratamiento
      };

      elemento.innerHTML = generarHTMLReceta(receta, logoUri);
      document.body.appendChild(elemento);
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("🔄 Generando canvas...");

      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: 1123
      });

      console.log("✅ Canvas generado");
      document.body.removeChild(elemento);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");

      console.log("✅ PDF creado");

      if (returnType === 'url') {
        resolve(pdf.output('bloburl'));
      } else {
        resolve(pdf.output('blob'));
      }

    } catch (error) {
      console.error("❌ Error generando PDF:", error);
      try {
        const pdfBlob = await generarRecetaPDFSimple(formData, returnType, logoUri);
        resolve(pdfBlob);
      } catch (fallbackError) {
        reject(fallbackError);
      }
    }
  });
};

// Versión simple con jsPDF (MISMO DISEÑO)
export const generarRecetaPDFSimple = async (formData, returnType = 'blob') => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 15;
      const marginLeft = 15;
      const marginRight = 15;

      // HEADER - Logo cuadrado
      pdf.setDrawColor(221, 221, 221);
      pdf.setLineWidth(0.5);
      pdf.rect(marginLeft, yPos, 24, 24);

      // Nombre del médico
      pdf.setTextColor(0, 119, 182);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(safe(formData.doctorNombre), marginLeft + 28, yPos + 8);

      pdf.setFontSize(13);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(51, 51, 51);
      pdf.text("Médico General", marginLeft + 28, yPos + 14);
      pdf.text(`Cédula: ${safe(formData.doctorCedula)}`, marginLeft + 28, yPos + 20);

      // Contacto derecha
      pdf.setFontSize(12);
      pdf.text(`Tel: ${safe(formData.doctorTelefono)}`, pageWidth - marginRight, yPos + 8, { align: "right" });
      pdf.text(`Email: ${safe(formData.doctorEmail)}`, pageWidth - marginRight, yPos + 14, { align: "right" });

      // Línea azul
      yPos += 28;
      pdf.setDrawColor(0, 119, 182);
      pdf.setLineWidth(1);
      pdf.line(marginLeft, yPos, pageWidth - marginRight, yPos);

      yPos += 15;

      // DATOS DEL PACIENTE
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 119, 182);
      pdf.text("Datos del Paciente", marginLeft, yPos);

      yPos += 8;
      pdf.setFontSize(12);
      pdf.setTextColor(51, 51, 51);

      const col1 = marginLeft;
      const col2 = pageWidth / 2 + 5;

      pdf.setFont("helvetica", "bold");
      pdf.text("Paciente:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(safe(formData.pacienteNombre), col1 + 23, yPos);

      pdf.setFont("helvetica", "bold");
      pdf.text("Edad:", col2, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(safe(formData.pacienteEdad), col2 + 13, yPos);

      yPos += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Fecha Nac.:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(formatDate(formData.pacienteNacimiento), col1 + 28, yPos);

      pdf.setFont("helvetica", "bold");
      pdf.text("Teléfono:", col2, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(safe(formData.pacienteTelefono), col2 + 21, yPos);

      yPos += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Fecha de Receta:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(formatDate(new Date().toISOString()), col1 + 38, yPos);

      yPos += 8;
      pdf.setFont("helvetica", "bold");
      pdf.text("Alergias/Diagnóstico:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      const alergiasSplit = pdf.splitTextToSize(safe(formData.pacienteAlergias), pageWidth - marginLeft - marginRight - 50);
      pdf.text(alergiasSplit, col1 + 48, yPos);

      yPos += 15;

      // SIGNOS VITALES
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 119, 182);
      pdf.text("Signos Vitales", marginLeft, yPos);

      yPos += 8;
      pdf.setFontSize(12);
      pdf.setTextColor(51, 51, 51);

      pdf.setFont("helvetica", "bold");
      pdf.text("Temperatura:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${safe(formData.temperatura)}°C`, col1 + 31, yPos);

      pdf.setFont("helvetica", "bold");
      pdf.text("Presión:", col2, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(safe(formData.presion), col2 + 18, yPos);

      yPos += 6;
      pdf.setFont("helvetica", "bold");
      pdf.text("Estatura:", col1, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${safe(formData.estatura)} cm`, col1 + 21, yPos);

      yPos += 15;

      // RX SÍMBOLO
      pdf.setFontSize(80);
      pdf.setTextColor(0, 119, 182);
      pdf.setFont("helvetica", "bold");
      pdf.text("Rx", marginLeft, yPos + 20);

      yPos += 35;

      // TRATAMIENTO
      pdf.setFontSize(16);
      pdf.setTextColor(0, 119, 182);
      pdf.text("Tratamiento", marginLeft, yPos);

      yPos += 8;

      // Caja de tratamiento
      pdf.setFillColor(249, 251, 252);
      pdf.rect(marginLeft, yPos - 3, pageWidth - marginLeft - marginRight, 35, 'F');

      pdf.setDrawColor(0, 119, 182);
      pdf.setLineWidth(1.5);
      pdf.line(marginLeft, yPos - 3, marginLeft, yPos + 32);

      pdf.setFontSize(12);
      pdf.setTextColor(51, 51, 51);
      pdf.setFont("helvetica", "normal");
      const splitText = pdf.splitTextToSize(safe(formData.tratamiento), pageWidth - marginLeft - marginRight - 10);
      pdf.text(splitText, marginLeft + 5, yPos + 3);

      // FOOTER
      yPos = pdf.internal.pageSize.getHeight() - 25;

      pdf.setTextColor(153, 153, 153);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(safe(formData.doctorNombre), pageWidth / 2, yPos, { align: "center" });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Tel: ${safe(formData.doctorTelefono)} — Email: ${safe(formData.doctorEmail)}`, pageWidth / 2, yPos + 6, { align: "center" });

      console.log("✅ PDF simple creado");

      if (returnType === 'url') {
        resolve(pdf.output('bloburl'));
      } else {
        resolve(pdf.output('blob'));
      }

    } catch (error) {
      console.error("❌ Error generando PDF simple:", error);
      reject(error);
    }
  });
};

// Función para descarga
export const descargarRecetaPDF = async (formData, logoUri = '') => {
  try {
    const pdfBlob = await generarRecetaPDF(formData, 'blob', logoUri);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receta_${safe(formData.pacienteNombre).replace(/\s+/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("❌ Error descargando PDF:", error);
    throw error;
  }
};