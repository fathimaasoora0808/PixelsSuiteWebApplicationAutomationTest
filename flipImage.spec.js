const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require("fs");
const os = require("os");

test.setTimeout(120000);

test.describe.configure({
    mode:"serial"
});


const BASE_URL = "https://pixelssuite.com/";



const imagePath = path.join(
    __dirname,
    "assets/image.png"
);



async function openFlipImage(page){

    await page.goto(BASE_URL,{
        waitUntil:"domcontentloaded",
        timeout:60000
    });


    await page.getByRole('button',{
        name:/More/
    }).click();


    await page.waitForTimeout(1500);


    await page.getByRole('button',{
        name:"Flip Image",
        exact:true
    }).click();


    await page.waitForTimeout(5000);

}





test.beforeEach(async({page})=>{

    await openFlipImage(page);

});



//TC001

test("Verify Flip Image page loads successfully", async({page})=>{


    await expect(
        page.getByText("Flip Image")
    ).toBeVisible();


});





//TC002
test("Verify upload area displayed", async({page})=>{


    await expect(
        page.locator('input[type="file"]')
    ).toBeAttached();


});





//TC003
test("Verify Select Files button displayed", async({page})=>{


    await expect(
        page.getByRole('button',{
            name:/select/i
        })
    ).toBeVisible();


});





//TC004
test("Verify PNG image upload", async({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.waitForTimeout(3000);


    const canvas = page.locator("canvas");

    console.log(
        "Canvas count:",
        await canvas.count()
    );


    await expect(
        canvas.last()
    ).toBeVisible();

});






//TC005
test("Verify Horizontal Flip option displayed", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await expect(
        page.getByText(/horizontal/i)
    ).toBeVisible();


});






//TC006
test("Verify Vertical Flip option displayed", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await expect(
        page.getByText(/vertical/i)
    ).toBeVisible();


});







//TC007
test("Verify image flips horizontally", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/horizontal/i)
    .click();



    await expect(
        page.locator("canvas,img").last()
    ).toBeVisible();



});







//TC008
test("Verify image flips vertically", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/vertical/i)
    .click();



    await expect(
        page.locator("canvas,img").last()
    ).toBeVisible();


});






//TC009
test("Verify Horizontal followed by Vertical flip", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/horizontal/i).click();


    await page.getByText(/vertical/i).click();



    await expect(
        page.locator("canvas,img").last()
    ).toBeVisible();


});






//TC010
test("Verify flipped image download", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    const downloadPromise =
    page.waitForEvent("download");



    await page.getByText(/download png/i)
    .click();



    const download =
    await downloadPromise;



    expect(
        download.suggestedFilename()
    )
    .toContain(".png");


});







//TC011
test("Verify clear button works", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/clear/i)
    .click();



    await expect(
        page.locator('input[type="file"]')
    )
    .toBeAttached();


});




// TC012
test("Verify uploaded image preview", async ({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.waitForTimeout(3000);


    const canvas = page.locator("canvas").last();


    await expect(canvas).toBeVisible();


    const size = await canvas.evaluate(c => {

        return {
            width: c.width,
            height: c.height
        };

    });


    console.log("Canvas size:", size);


    expect(size.width).toBeGreaterThan(0);

    expect(size.height).toBeGreaterThan(0);


});



// TC013
test("Verify Horizontal Flip button visible", async({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await expect(
        page.getByText(/horizontal/i)
    ).toBeVisible();

});



// TC014
test("Verify Vertical Flip button visible", async({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await expect(
        page.getByText(/vertical/i)
    ).toBeVisible();

});



// TC015
test("Verify horizontal flip works", async({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.getByText(/horizontal/i)
    .click();


    await page.waitForTimeout(2000);


    await expect(
        page.locator("canvas").last()
    ).toBeVisible();

});




// TC016
test("Verify vertical flip works", async({page})=>{

    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.getByText(/vertical/i)
    .click();


    await page.waitForTimeout(2000);


    await expect(
        page.locator("canvas").last()
    ).toBeVisible();

});





// TC017
test("Verify horizontal and vertical flip together", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/horizontal/i)
    .click();


    await page.waitForTimeout(1000);


    await page.getByText(/vertical/i)
    .click();



    await page.waitForTimeout(2000);



    await expect(
        page.locator("canvas").last()
    ).toBeVisible();


});






// TC018
test("Verify clear button removes image", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.waitForTimeout(3000);


    await page.getByText(/clear/i)
    .click();


    await page.waitForTimeout(3000);



    const canvas =
        page.locator("canvas").last();



    const size =
        await canvas.evaluate(c => {

            return {
                width:c.width,
                height:c.height
            }

        });



    console.log(
        "Canvas after clear:",
        size
    );



    expect(size.width).toBe(0);

    expect(size.height).toBe(0);


});






//TC018
test("Verify download button visible", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await expect(
        page.getByText(/download/i)
    ).toBeVisible();


});






// TC019
test("Verify flipped image download works", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.getByText(/horizontal/i)
    .click();



    const downloadPromise =
    page.waitForEvent("download");



    await page.getByText(/download/i)
    .click();



    const download =
    await downloadPromise;



    expect(
        download.suggestedFilename()
    )
    .toMatch(/png|jpg|jpeg/i);


});






// TC020
test("Verify replacing uploaded image", async({page})=>{


    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await page.waitForTimeout(2000);



    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);



    await expect(
        page.locator("canvas").last()
    ).toBeVisible();


});






// TC021
test("Verify PNG file accepted", async({page})=>{


    const input =
    page.locator('input[type="file"]');



    await expect(input)
    .toBeAttached();



    await input.setInputFiles(imagePath);



    await page.waitForTimeout(2000);



    await expect(
        page.locator("canvas")
    ).toBeVisible();


});



//TC022
test("Verify flipped image downloads into Downloads folder", async({page})=>{


    // upload image
    await page.locator('input[type="file"]')
    .setInputFiles(imagePath);


    await page.waitForTimeout(3000);



    // perform flip
    await page.getByText(/horizontal/i)
    .click();



    await page.waitForTimeout(2000);



    // capture download
    const downloadPromise =
        page.waitForEvent("download");



    // click download button
    await page.getByText(/download/i)
    .click();



    const download =
        await downloadPromise;



    // Desktop Downloads folder path
    const downloadsFolder = path.join(
        os.homedir(),
        "Downloads"
    );



    const filePath = path.join(
        downloadsFolder,
        download.suggestedFilename()
    );



    // save downloaded file
    await download.saveAs(filePath);



    console.log(
        "Downloaded file:",
        filePath
    );



    // verify file exists
    expect(
        fs.existsSync(filePath)
    ).toBeTruthy();



});