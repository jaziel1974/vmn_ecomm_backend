/*
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

function receiptsPdf(orders) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = [];

    console.log("orders", orders);
    const dataReport = orders.map((order) => {
        return [
            { text: order.Customers[0].name, fontSize: 9 },
        ]
    })

    console.log("dataReport", dataReport);

    const details = [{
        table: {
            headerRows: 1,
            widths: ['*'],
            body: dataReport,
        },
        layout: 'headerLineOnly'
    }];
    const footer = [];

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: [footer]
    };

    pdfMake.createPdf(docDefinitions).open();
}

export default receiptsPdf;
*/