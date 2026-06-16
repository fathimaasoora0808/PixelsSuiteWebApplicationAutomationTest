const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test.setTimeout(120000);

const PDF_FILE = path.join(__dirname, '../test-data/sample.pdf');

async function openPdfEditor(page) {


  let loaded = false;


  for(let i = 0; i < 3; i++){

    try{

      await page.goto(
        'https://www.pixelssuite.com',
        {
          waitUntil:'commit',
          timeout:90000
        }
      );


      await page.waitForLoadState(
        'domcontentloaded',
        {
          timeout:60000
        }
      );


      loaded = true;

      break;


    }
    catch(error){

      console.log(
        "Retry loading website:",
        i+1
      );

      await page.waitForTimeout(5000);

    }

  }



  if(!loaded){

    throw new Error(
      "Pixelssuite website failed after retries"
    );

  }




  await page.getByRole('button',{
    name:'Editor ▾'
  })
  .click();



  await page.getByRole('button',{
    name:'PDF Editor'
  })
  .click();



  await expect(
    page.getByText('PDF Editor').first()
  )
  .toBeVisible({
    timeout:60000
  });


}



async function uploadPdf(page) {

  const path = require('path');
  const fs = require('fs');

  const filePath = path.resolve(__dirname, '../test-data/sample.pdf');

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }


const fileChooserPromise = page.waitForEvent('filechooser');

  await page.getByRole('button', { name: /choose file/i }).click();

  const fileChooser = await fileChooserPromise;

  await fileChooser.setFiles(filePath);

  await page.waitForTimeout(3000);
}

//TC001
test('Verify PDF Editor page loads', async ({ page }) => {

  await openPdfEditor(page);

  await expect(page).toHaveURL(/editor/i);

});

//TC002
test('Choose File button visible', async ({ page }) => {

  await openPdfEditor(page);

  await expect(
    page.getByRole('button', {
      name: /choose file/i
    })
  ).toBeVisible();

});

//TC003
test('Upload PDF successfully', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
  page.locator('canvas').first()
).toBeVisible();

});


//TC004
test('Undo button disabled initially', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const undoButton =
    page.getByRole('button', {
      name: /undo/i
    });

  await expect(undoButton)
    .toBeDisabled();

});

//TC005
test('Undo button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const undoButton =
    page.getByRole('button', {
      name: /undo/i
    });

  await expect(undoButton)
    .toBeVisible();

});

//TC006
test('Redo button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const redoButton =
    page.getByRole('button', {
      name: /redo/i
    });

  await expect(redoButton)
    .toBeVisible();

});

//TC007
test('Redo button disabled initially', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const redoButton =
    page.getByRole('button', {
      name: /redo/i
    });

  await expect(redoButton)
    .toBeDisabled();

});

//TC008
test('Toggle detected text boxes visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.getByRole('button', {
      name: /toggle/i
    })
  ).toBeVisible();

});

//TC009
test('Download button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.getByRole('button', {
      name: /download/i
    })
  ).toBeVisible();

});


//TC010
test('Text tool selectable', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const textTool = page.getByRole('button', {
    name: 'Text',
    exact: true
  });

  await textTool.click();

  await expect(textTool).toBeVisible();

});


//TC011
test('Pencil tool selectable', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await page.getByRole('button', {
    name: /pencil/i
  }).click();

  await expect(
    page.getByRole('button', {
      name: /pencil/i
    })
  ).toBeVisible();

});


//TC012
test('Highlight tool selectable', async ({ page }) => {
  test.setTimeout(120000);

  await openPdfEditor(page);

  await uploadPdf(page);

  await page.getByRole('button', {
    name: /highlight/i
  }).click();

  await expect(
    page.getByRole('button', {
      name: /highlight/i
    })
  ).toBeVisible();

});


//TC013
test('Whiteout tool selectable', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await page.getByRole('button', {
    name: /whiteout/i
  }).click();

  await expect(
    page.getByRole('button', {
      name: /whiteout/i
    })
  ).toBeVisible();

});


//TC014
test('Eraser tool selectable', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await page.getByRole('button', {
    name: /eraser/i
  }).click();

  await expect(
    page.getByRole('button', {
      name: /eraser/i
    })
  ).toBeVisible();

});


//TC015
test('Font dropdown visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.locator('select')
  ).toBeVisible();

});

//TC016
test('Bold button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await page.getByRole('button', {
  name: 'Text',
  exact: true
}).click();

await page.waitForTimeout(2000);

await expect(
  page.locator('button[title="Bold"]')
).toBeVisible();
});


//TC017
test('Left align button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.getByRole('button', {
      name: /^L$/i
    })
  ).toBeVisible();

});

//TC018
test('Center align button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.getByRole('button', {
      name: /^C$/i
    })
  ).toBeVisible();

});

//TC019
test('Right align button visible', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  await expect(
    page.getByRole('button', {
      name: /^R$/i
    })
  ).toBeVisible();

});


//TC020
test('Download edited PDF', async ({ page }) => {

  await openPdfEditor(page);

  await uploadPdf(page);

  const downloadPromise =
    page.waitForEvent('download');

  await page.getByRole('button', {
    name: /download/i
  }).click();

  const download =
    await downloadPromise;

  expect(
    download.suggestedFilename()
  ).toContain('.pdf');

});

//TC021
test('Uploaded PDF displayed in editor workspace', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  await expect(
    page.locator('canvas').first()
  ).toBeVisible();

});

//TC022
test('All PDF pages rendered', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  const pages = page.locator('canvas');

  await expect(pages.first()).toBeVisible();

  expect(await pages.count()).toBeGreaterThan(0);

});

//TC023
test('Add Text tool selectable', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  const textTool = page.getByRole('button', {
    name: 'Text',
    exact: true
  });

  await textTool.click();

  await expect(textTool).toBeVisible();

});

//TC024
test('Font controls visible after selecting Text tool', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  await page.getByRole('button', {
    name: 'Text',
    exact: true
  }).click();

  await expect(
    page.locator('select')
  ).toBeVisible();

});

//TC025
test('Download PDF works', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  const downloadPromise =
    page.waitForEvent('download');

  await page.getByRole('button', {
    name: /download/i
  }).click();

  const download =
    await downloadPromise;

  expect(
    download.suggestedFilename()
  ).toContain('.pdf');

});


// TC026
test('Add REAL text into PDF', async ({ page }) => {

  await openPdfEditor(page);
  await uploadPdf(page);

  const textTool = page.getByRole('button', {
    name: 'Text',
    exact: true
  });

  await textTool.click();

  // WAIT for tool activation
  await page.waitForTimeout(1000);

  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();

  if (!box) throw new Error('Canvas not found');

  // 🔥 IMPORTANT: use page.mouse NOT locator.click
  await page.mouse.click(
    box.x + 300,
    box.y + 300
  );

  await page.waitForTimeout(500);

  // now try typing
  await page.keyboard.type('Automation Test Text');

  await page.waitForTimeout(1000);

  await expect(canvas).toBeVisible();
});








// TC027
test('Highlight text in PDF', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const highlight =
    page.getByRole('button',{
        name:/highlight/i
    });


    await highlight.click();



    await expect(highlight)
    .toBeVisible();



    await page.waitForTimeout(3000);



    // drag inside PDF page
    await page.mouse.move(
        500,
        400
    );


    await page.mouse.down();



    await page.mouse.move(
        650,
        450,
        {
            steps:20
        }
    );


    await page.mouse.up();



    await page.waitForTimeout(2000);


});








// TC028
test('Whiteout text area in PDF', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const whiteout =
        page.getByRole('button',{
            name:/whiteout/i
        });


    await whiteout.click();



    await page.waitForTimeout(2000);



    await page.mouse.move(
        500,
        400
    );


    await page.mouse.down();



    await page.mouse.move(
        600,
        500,
        {
            steps:20
        }
    );


    await page.mouse.up();



    await page.waitForTimeout(3000);


});








// TC029
test('Change font style', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'Text',
        exact:true
    }).click();



    const font =
        page.locator('select');


    await font.selectOption({
        label:'Roboto'
    });



    await expect(font)
    .toHaveValue(
        'Roboto'
    );


});









// TC030
test('Increase text size', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'Text',
        exact:true
    }).click();



    const size =
        page.locator('input[type="number"]');



    await size.fill('30');



    await expect(size)
    .toHaveValue('30');


});









// TC031
test('Make text bold', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'Text',
        exact:true
    }).click();



    const bold =
        page.locator(
            'button[title="Bold"]'
        );



    await expect(bold)
    .toBeVisible();


    await bold.click();


});









// TC032
test('Text left alignment', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'L',
        exact:true
    }).click();



});









// TC033
test('Text center alignment', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'C',
        exact:true
    }).click();



});









// TC034
test('Text right alignment', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    await page.getByRole('button',{
        name:'R',
        exact:true
    }).click();



});









// TC035
test('Change text color', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const color =
    page.locator('input[type="color"]');



    await color.fill('#ff0000');


});









// TC036
test('Zoom in PDF', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const zoom =
    page.locator('input[type="range"]');



    await zoom.evaluate(
        element=>{
            element.value=1.5;
            element.dispatchEvent(
                new Event('input')
            );
        }
    );


});









// TC037
test('Zoom out PDF', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const zoom =
    page.locator('input[type="range"]');



    await zoom.evaluate(
        element=>{
            element.value=0.8;
            element.dispatchEvent(
                new Event('input')
            );
        }
    );


});









// TC038
test('Download edited PDF to Downloads folder', async({page})=>{


    await openPdfEditor(page);

    await uploadPdf(page);



    const downloadPromise =
        page.waitForEvent('download');



    await page.getByRole('button',{
        name:/download/i
    }).click();



    const download =
        await downloadPromise;



    const downloadPath =
        path.join(
            process.env.USERPROFILE,
            'Downloads',
            await download.suggestedFilename()
        );



    await download.saveAs(downloadPath);



    console.log(
        "Saved file:",
        downloadPath
    );



    expect(
        fs.existsSync(downloadPath)
    )
    .toBeTruthy();


});