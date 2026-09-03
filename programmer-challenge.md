# UofL Integrative Design and Development - Programmer Coding Challenge
# Overview
The following coding challenge is designed to assess your skills in web developing, AI / Machine Learning integration, and collaborative development practices.

# Challenge:
The challenge is to take the included data set, labeled "catalog dev", which is a copy of our course catalog in .csv (comma separated values) format, and to render it into a series of cards that display the Subject, Catalog Number and Description.

For Example, a card may render:

```
┌─────────────────────────────────────┐
│ PHIL 459 - Philosophy of Technology │
└─────────────────────────────────────┘
```

At minimum please develop a front page that displays an overall title for the page, "UofL Course Catalog", and renders 10 cards therein with the specified information - Subject, Catalog Number and Description.

Translating the data into a web readable format, such as JSON, should take a script written or package used to translate the data from .csv to JSON.

Extra work includes a search bar under the title, wherein the user can type in an input and expect that it matches the course title. For instance if the user were to type, "Philosophy of Technology", they would expect the "Philosophy of Technology" card to render.

Extra functionality may include a pagination functionality wherein the user can explore the entire data set, not only the 10 cards, or an infinite scroll feature to traverse the data set.

Extra functionality may also include adding a filter to seperate the data by subject or department.

# Time:

The deadline for submitting this challenge is 8:00am, Monday 8/31/2026.

# Technical Specifications

**Front End Requirements**
- HTML, CSS, JavaScript and / or Python.
- ReactJS, NextJS
- Responsive mobile-first design

**Back End Requirements**
- NodeJS or Python Frameworks
- JSON Data Storage File type

**Code Quality**
- Clean, readable code with meaningful variable names.
- Commented code for complex logic
- Proper Error Handling and Logging
- Git version control with meaningful commit messages.

# Deliverables
1. *Source Code*
    - Complete Project Files
    - README.md with setup and other important instructions
    - Package Requirements file (package.json, requirements.txt, ...)
2. *Documentation*
    - Provide a brief explanation of your approach in the README.md
    - Provide Instructions to run the Code Base in the README.md
    - Provide a List of Features in the README.md
3. *Demo*
    - Application should build and run locally
    - Please host your project onto Github and publish it with Github Pages which will provide a link you could share to us that will render the project on Github's servers.

# Sample JSON Data structure
```json
{
    "data": [
        {
            "CRSE_ID": 17844,
            "SUBJECT": "PHIL",
            "CATALOG_NBR_": "459",
            "DESCR": "PHIL OF TECHNOLOGY",
            // ...
        },
        {
            "CRSE_ID": 32132,
            "SUBJECT": "PHIL",
            "CATALOG_NBR_": "345",
            "DESCR": "PHIL OF RELIGION",
            // ...
        },
        // ...
    ]
} 
```

# Evaluation Criteria

**Technical Skills**
    - Code quality and organization
    - Proper use of HTML, CSS, Javascript or Python
    - Implementation of the required steps of the Challenge
**User Experience**
    - Design and usability
    - Responsive mobile-first approach
    - Clear user-flows and error feedback
**Innovation and Bonus Features**
    - Creative solutions to problem solving
    - Additional features or styling beyond bare requirements
    - Use of modern frameworks and solutions
    - AI / ML integration attempts
**Documentation and Communication**
    - Clear README and setup instructions
    - Code comments and other documentation
    - Git commit history with meaningful commit messages
    - Explanation of design decisions

# Submission Instructions

1. Provide a Github Repository for your project
2. Include all source code and documentation within the repository
3. Ensure the application can be run locally with the provided instructions
4. Please publish the application onto Github pages which will provide a link you can share to us to see the front end render.
5. Email the link to the repository itself, as well as the Github pages link to the Senior Director for IT Innovation at the Integrative Design and Development team.  