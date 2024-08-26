const puppeteer = require("puppeteer");
const xlsx = require("xlsx");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector(".cust-job-tuple");

  const jobs = await page.$$eval(".cust-job-tuple", (cards) => {
    return cards.map((card) => {
      const titleElement = card.querySelector(".row1 a.title");
      const companyElement = card.querySelector(".row2 .comp-name");
      const experienceElement = card.querySelector(
        ".row3 .exp-wrap span.expwdth"
      );
      const salaryElement = card.querySelector(".row3 .sal-wrap span");
      const locationElement = card.querySelector(".row3 .loc-wrap span");
      const ratingElement = card.querySelector(".row2 .rating span.main-2");
      const reviewsElement = card.querySelector(".row2 .review");
      const jobDescription = card.querySelector(".row4 .job-desc");

      const title = titleElement ? titleElement.innerText : null;
      const company = companyElement ? companyElement.innerText : null;
      const experience = experienceElement ? experienceElement.innerText : null;
      const salary = salaryElement ? salaryElement.innerText : null;
      const location = locationElement ? locationElement.innerText : null;
      const rating = ratingElement ? ratingElement.innerText : "No Rating";
      const reviews = reviewsElement ? reviewsElement.innerText : "No Reviews";
      const description = jobDescription ? jobDescription.innerText : null;

      return {
        title,
        company,
        experience,
        salary,
        location,
        rating,
        reviews,
        description,
      };
    });
  });

  console.log(jobs);

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(jobs);

  xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");

  xlsx.writeFile(workbook, "jobs.xlsx");

  // Close Puppeteer
  await browser.close();
})();
