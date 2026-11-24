# swyft-hq.com snippet

The Swyft marketing site source is `colinmspeer-ct/swyft-hq`, not this repository, so this preview does not edit it and does not change DNS. Paste the pieces below into that repo when Colin wants the branch linked.

Do not point swyftinternational.com at anything until he says to launch.

## 1. Nav item in `src/lib.mjs`

Inside `header()`, add one entry to the `links` array. Desktop and mobile both use it.

```js
const links = [
  ['/services/', 'Services'],
  ['/services/swyft-international/', 'Swyft International'],
  ['/industries/', 'Industries'],
  ['/blog/', 'Blog'],
  ['/about/', 'About'],
];
```

## 2. Service record in `src/data.mjs`

Add to the `services` array (the services footer is generated from this list):

```js
{
  key: 'swyft-international',
  url: '/services/swyft-international/',
  name: 'Swyft International',
  short: 'Offshore placement',
  division: 'Swyft International',
  blurb: 'Offshore talent in Egypt and Belize. You pay the hire. We earn a success fee when they start.',
},
```

Add to `divisions`:

```js
{
  key: 'international',
  name: 'Swyft International',
  tag: 'Placement',
  body: 'A database of operators in Egypt and Belize, placed with US companies. You pay the hire.',
  service: 'swyft-international',
},
```

Add to `serviceInterestOptions`:

```js
'Swyft International (offshore placement)',
```

## 3. New file `content/services/swyft-international.mjs`

```js
export default {
  key: 'swyft-international',
  keyword: 'offshore talent placement for home service companies',
  title: 'Swyft International | Offshore Talent Placement',
  description: 'Swyft International places talent in Egypt and Belize with US companies. You pay the hire. A success fee is due when they start, a deposit starts a new search, and a replacement search is included.',
  h1: 'Offshore talent placement for companies that <span class="grad">already know who they need.</span>',
  serviceType: 'Offshore talent placement',
  interest: 'Swyft International (offshore placement)',
  answer: 'Swyft International is the placement arm of Swyft. We keep a database of operators in Egypt and Belize. If someone fits, you interview them from a shortlist. If nobody fits, a deposit starts a new search and is credited toward the success fee. You pay the hire directly. Call the number already published on this site.',
  intro: 'This is a branch of Swyft Marketing, led by Colin Speer. The working preview is not attached to a live domain yet.',
  stats: [
    { value: '33%', label: 'Success fee of year-one salary' },
    { value: '$500', label: 'Deposit only if we open a new search' },
    { value: '90 days', label: 'Free replacement search' },
    { value: 'You pay them', label: 'Salary never runs through Swyft' },
  ],
  offerings: [
    { title: 'Database first', body: 'We look at people we already know before opening a search.' },
    { title: 'A shortlist, not a resume pile', body: 'You get a small set of people you can actually meet.' },
    { title: 'A deposit when we have to search', body: 'The deposit is credited toward the success fee.' },
    { title: 'Replacement window', body: 'If the hire leaves inside the window, the next search is free.' },
  ],
  steps: [
    { title: 'Name the seat', body: 'Role, salary, and the hours you need covered.' },
    { title: 'Check the database', body: 'A fit goes on a shortlist. That path has no search deposit.' },
    { title: 'Or open a search', body: 'The deposit starts it and comes off the fee.' },
    { title: 'Hire and pay them', body: 'You pay the person. We invoice the success fee when they start.' },
  ],
  sections: `
<h2>What Swyft International does</h2>
<p>Swyft International places offshore talent with US companies, starting with Egypt and Belize. It is a branch of Swyft Marketing. The hire's salary is paid by the client. Swyft earns a success fee when the person starts.</p>
<p>The current commercial terms, which Colin can change, are a success fee of 33% of the hire's first-year salary, a $500 deposit to start a search when the database has no fit, and a 90-day free replacement search. The deposit is credited toward the fee. Confirm the current figures on a call.</p>
<h2>Where it will live</h2>
<p>The intended site is swyftinternational.com. It is not linked from DNS by this preview. Use the contact paths already on swyft-hq.com until that domain is deliberately launched.</p>
`,
  faqs: [
    { q: 'Who pays the hire?', a: 'You do, directly. Swyft does not run payroll for the placement.' },
    { q: 'When is the deposit due?', a: 'Only when nobody already in the database can do the job. It is credited toward the success fee.' },
    { q: 'What if they leave?', a: 'Inside the replacement window, the next search is free.' },
  ],
  faqHeading: 'Questions about Swyft International',
  formHeading: 'Ask about a seat',
};
```

Rebuild swyft-hq with its own script after pasting. Do not treat that rebuild as a launch of swyftinternational.com.
