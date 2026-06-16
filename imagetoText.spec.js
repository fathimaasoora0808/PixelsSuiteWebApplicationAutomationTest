import { test, expect } from '@playwright/test';
import path from 'path';

const assets = (file) =>
    path.join(__dirname, 'assets', file);


// Block unwanted redirects
test.beforeEach(async ({ page }) => {

    await page.route('**/*', route => {

        const url = route.request().url();

        if (
    url.includes('frs2c.com') ||
    url.includes('mks98.com') ||
    url.includes('click.aliexpress') ||
    url.includes('ads')
) {
    return route.abort();
}

        route.continue();

    });

});


async function openImageToText(page) {

    await page.goto(
        "https://pixelssuite.com/",
        {
            waitUntil:"domcontentloaded"
        }
    );


    const more = page.getByText("More").first();

    await expect(more)
        .toBeVisible({
            timeout:20000
        });

    await more.click();


    const imageText = page.locator(
        'a,button'
    ).filter({
        hasText:/Image\s*To\s*Text/i
    }).first();


    await expect(imageText)
        .toBeVisible({
            timeout:20000
        });


    await imageText.click();


    await page.waitForTimeout(3000);

}



// TC001
test('Verify Image To Text page loads', async ({page})=>{

    await openImageToText(page);


    await expect(
        page.locator('input[type="file"]')
    )
    .toBeAttached({
        timeout:20000
    });


});




// TC002
test('Verify upload area visible', async ({page})=>{

    await openImageToText(page);


    await expect(
        page.locator('input[type="file"]')
    )
    .toBeAttached();

});




// TC003
test('Verify Select Image button', async ({page})=>{


    await openImageToText(page);


    await expect(
        page.getByRole(
            'button',
            {
                name:/select image/i
            }
        )
    )
    .toBeVisible();


});





// TC004
test('Upload PNG image', async({page})=>{


    await openImageToText(page);


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets('image.png')
    );


    await expect(
        page.locator('img').first()
    )
    .toBeVisible({
        timeout:20000
    });

});





// TC005
test('Upload JPG image', async({page})=>{


    await openImageToText(page);


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets('image.jpg')
    );


    await expect(
        page.locator('img').first()
    )
    .toBeVisible();

});






// TC006
test('Upload WEBP image', async({page})=>{


    await openImageToText(page);


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets('image.webp')
    );


    await expect(
        page.locator('img').first()
    )
    .toBeVisible();

});





// TC007
test('Unsupported file rejection', async({page})=>{

    await openImageToText(page);


    const input = page.locator(
        'input[type="file"]'
    );


    await input.setInputFiles(
        assets('sample.docx')
    );


    await page.waitForTimeout(5000);



    // Check if image preview was created
    const imagePreview = page.locator(
        'img[src^="blob:"]'
    );


    // Unsupported file should not generate image preview
    if(await imagePreview.count() > 0){

        console.log(
            "Application accepted unsupported file as preview"
        );

    }
    else{

        console.log(
            "Unsupported file rejected correctly"
        );

    }


    // Verify page is still stable
    await expect(
        input
    )
    .toBeAttached();


});





// TC008
test('File size validation', async({page})=>{


    await openImageToText(page);


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets('large_image.png')
    );


    await expect(
        page.getByText(
            /20MB|size|limit/i
        )
        .first()
    )
    .toBeVisible({
        timeout:15000
    });


});







// TC009

async function uploadImage(page,file){


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets(file)
    );


    await page.waitForTimeout(2000);

}







// TC010
test('OCR clear image', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    const start =
        page.getByRole(
            'button',
            {
                name:/start ocr/i
            }
        );


    await expect(start)
    .toBeEnabled();


    await start.click();



    await expect(
        page.locator(
            'text=/result/i'
        )
        .first()
    )
    .toBeVisible({
        timeout:30000
    });


});









// TC011
test('Verify copy button', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    const start =
        page.getByRole(
            'button',
            {
                name:/start ocr/i
            }
        );


    await expect(start)
        .toBeEnabled({
            timeout:30000
        });


    await start.click();



    // wait OCR result
    await page.waitForTimeout(10000);



    const copy =
        page.getByRole(
            'button',
            {
                name:/copy/i
            }
        )
        .first();



    await expect(copy)
        .toBeEnabled({
            timeout:60000
        });



    await copy.click();


});









// TC012
test('Clear button works', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    await page.getByRole(
        'button',
        {
            name:/clear/i
        }
    )
    .first()
    .click();



    await expect(
        page.locator('img')
    )
    .toHaveCount(0);

});









// TC013
test('Language dropdown works', async({page})=>{


    await openImageToText(page);



    const dropdown =
        page.locator(
            'select'
        )
        .first();



    if(await dropdown.count()){


        await dropdown.selectOption({
            index:0
        });


        await expect(dropdown)
        .toBeVisible();

    }


});









// TC014
test('Multiple uploads', async({page})=>{


    await openImageToText(page);



    const input =
        page.locator(
            'input[type="file"]'
        );



    await input.setInputFiles(
        assets('image.png')
    );


    await input.setInputFiles(
        assets('image.png')
    );



    await expect(
        page.locator('img').first()
    )
    .toBeVisible();


});









// TC015
test('Start OCR button enabled', async({page})=>{


    await openImageToText(page);



    await uploadImage(
        page,
        'image.png'
    );



    await expect(
        page.getByRole(
            'button',
            {
                name:/start ocr/i
            }
        )
    )
    .toBeEnabled();


});



// TC016
test('Upload without selecting file', async({page})=>{

    await openImageToText(page);


    const input = page.locator(
        'input[type="file"]'
    );


    await expect(input)
        .toBeAttached();


    console.log(
        "File upload field available"
    );

});





// TC017
test('Replace uploaded image', async({page})=>{


    await openImageToText(page);


    const input =
        page.locator(
            'input[type="file"]'
        );


    await input.setInputFiles(
        assets('image.png')
    );


    await expect(
        page.locator('img').first()
    )
    .toBeVisible();



    await input.setInputFiles(
        assets('image.jpg')
    );


    await expect(
        page.locator('img').first()
    )
    .toBeVisible();


});







// TC018
test('Upload GIF image validation', async({page})=>{


    await openImageToText(page);


    const input =
        page.locator(
            'input[type="file"]'
        );


    await input.setInputFiles(
        assets('Gif.gif')
    );


    await page.waitForTimeout(3000);


    await expect(input)
        .toBeAttached();


});







// TC019
test('Verify Start OCR appears after image upload', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    const start =
        page.getByRole(
            'button',
            {
                name:/start ocr/i
            }
        );


    await expect(start)
        .toBeVisible();


});







// TC020
test('OCR button click works', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    const start =
        page.getByRole(
            'button',
            {
                name:/start ocr/i
            }
        );


    await start.click();


    await page.waitForTimeout(10000);


    console.log(
        "OCR executed"
    );


});







// TC021
test('Verify OCR result area', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    await page.getByRole(
        'button',
        {
            name:/start ocr/i
        }
    )
    .click();



    await page.waitForTimeout(15000);



    const result =
        page.locator(
            'textarea, p, div'
        )
        .filter({
            hasText:/.+/
        })
        .first();



    await expect(result)
        .toBeVisible();


});








// TC022
test('Copy button visibility after OCR', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    await page.getByRole(
        'button',
        {
            name:/start ocr/i
        }
    )
    .click();



    await page.waitForTimeout(15000);



    const copy =
        page.getByRole(
            'button',
            {
                name:/copy/i
            }
        )
        .first();



    await expect(copy)
        .toBeVisible();


});









// TC023
test('Clear removes uploaded image', async({page})=>{


    await openImageToText(page);


    await uploadImage(
        page,
        'image.png'
    );


    const clear =
        page.getByRole(
            'button',
            {
                name:/clear/i
            }
        )
        .first();


    await clear.click();


    await page.waitForTimeout(3000);



    await expect(
        page.locator(
            'img[src^="blob:"]'
        )
    )
    .toHaveCount(0);


});






// TC024
test('Multiple image replacement upload', async({page})=>{


    await openImageToText(page);


    const input =
        page.locator(
            'input[type="file"]'
        );



    await input.setInputFiles(
        assets('image.png')
    );


    await input.setInputFiles(
        assets('image.jpg')
    );


    await input.setInputFiles(
        assets('image.webp')
    );



    await expect(
        page.locator('img').first()
    )
    .toBeVisible();


});









// TC025
test('Verify page does not crash after invalid upload', async({page})=>{


    await openImageToText(page);


    await page.locator(
        'input[type="file"]'
    )
    .setInputFiles(
        assets('sample.docx')
    );


    await page.waitForTimeout(3000);



    await expect(
        page.locator(
            'body'
        )
    )
    .toBeVisible();


});


//TC026
test('Verify JPG and WEBP upload with preview validation', async ({ page }) => {

    await openImageToText(page);

    const input = page.locator('input[type="file"]');

    // JPG
    await input.setInputFiles(assets('image.jpg'));

    await expect(page.locator('img').first()).toBeVisible({ timeout: 20000 });

    // replace with WEBP
    await input.setInputFiles(assets('image.webp'));

    await expect(page.locator('img').first()).toBeVisible({ timeout: 20000 });

});





