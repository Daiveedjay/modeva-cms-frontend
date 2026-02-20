import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDownloadOrderInvoicePDF() {
  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      orderNumber: string;
      invoiceElement: HTMLElement;
    }) => {
      try {
        const [jsPDFModule, html2canvasPro] = await Promise.all([
          import("jspdf").then((m) => m.jsPDF),
          import("html2canvas-pro").then((m) => m.default),
        ]);

        const element = params.invoiceElement;

        // Clone element to avoid modifying the DOM
        const clonedElement = element.cloneNode(true) as HTMLElement;

        // Create a temporary container
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "-9999px";
        tempContainer.style.width = element.offsetWidth + "px";
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        try {
          const canvas = await html2canvasPro(clonedElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            windowHeight: clonedElement.scrollHeight,
            windowWidth: clonedElement.scrollWidth,
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDFModule({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`invoice-${params.orderNumber}.pdf`);
          // toast.success("Invoice downloaded successfully");
        } finally {
          document.body.removeChild(tempContainer);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to download invoice";
        toast.error(message);
        throw error;
      }
    },
  });
}
