"""Backend-only college seed records — loaded into DB at startup."""

COLLEGES_SEED_DATA = [
        {
            "name": "Indian Institute of Technology, Bombay (IITB)",
            "location": "Mumbai, Maharashtra",
            "fees": 230000,
            "rating": 4.9,
            "courses": "B.Tech Computer Science, B.Tech Electrical, B.Tech Mechanical, B.Tech Chemical, B.Tech Aerospace",
            "placements_pct": 98.2,
            "package_median": 18.5,
            "package_highest": 140.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/IIT_Bombay_Logo.svg/300px-IIT_Bombay_Logo.svg.png",
            "description": "Established in 1958, IIT Bombay is a premier public technical and research university in Mumbai. It is recognized as an Institute of Eminence and is globally renowned for engineering and scientific education.",
            "cutoffs": [
                {"exam": "JEE Advanced", "branch": "Computer Science", "category": "General", "min_rank": 1, "max_rank": 67},
                {"exam": "JEE Advanced", "branch": "Electrical Engineering", "category": "General", "min_rank": 100, "max_rank": 290},
                {"exam": "JEE Advanced", "branch": "Mechanical Engineering", "category": "General", "min_rank": 300, "max_rank": 1200},
                {"exam": "JEE Advanced", "branch": "Aerospace Engineering", "category": "General", "min_rank": 1000, "max_rank": 2100}
            ],
            "reviews": [
                {"reviewer_name": "Rohan Sharma", "rating": 5.0, "text": "Unmatched research culture and brilliant peer group. Placement is excellent and campus life is vibrant."},
                {"reviewer_name": "Ananya Sen", "rating": 4.8, "text": "Very hectic schedule but totally worth it. The professors are top-class, and tech fests like Mood Indigo and Techfest are unforgettable."}
            ]
        },
        {
            "name": "Indian Institute of Technology, Delhi (IITD)",
            "location": "New Delhi, Delhi",
            "fees": 225000,
            "rating": 4.8,
            "courses": "B.Tech Computer Science, B.Tech Electrical, B.Tech Mechanical, B.Tech Civil, B.Tech Chemical",
            "placements_pct": 96.5,
            "package_median": 17.8,
            "package_highest": 125.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/IIT_Delhi_Logo.svg/300px-IIT_Delhi_Logo.svg.png",
            "description": "IIT Delhi is a premier public research university located in New Delhi. Founded in 1961, it offers state-of-the-art education across a variety of disciplines and maintains extremely strong tie-ups with global tech leaders.",
            "cutoffs": [
                {"exam": "JEE Advanced", "branch": "Computer Science", "category": "General", "min_rank": 5, "max_rank": 115},
                {"exam": "JEE Advanced", "branch": "Electrical Engineering", "category": "General", "min_rank": 150, "max_rank": 450},
                {"exam": "JEE Advanced", "branch": "Mechanical Engineering", "category": "General", "min_rank": 500, "max_rank": 1400},
                {"exam": "JEE Advanced", "branch": "Civil Engineering", "category": "General", "min_rank": 1500, "max_rank": 3500}
            ],
            "reviews": [
                {"reviewer_name": "Siddharth Mehta", "rating": 5.0, "text": "Located in the heart of Delhi, great connectivity, coding culture is insane, and seniors are super helpful!"},
                {"reviewer_name": "Priyanka Roy", "rating": 4.6, "text": "Hostels are slightly old but the academic block and libraries are premium. Labs are equipped with latest technologies."}
            ]
        },
        {
            "name": "Indian Institute of Technology, Madras (IITM)",
            "location": "Chennai, Tamil Nadu",
            "fees": 220000,
            "rating": 4.9,
            "courses": "B.Tech Computer Science, B.Tech Electrical, B.Tech Aerospace, B.Tech Mechanical, B.Tech Naval Architecture",
            "placements_pct": 97.0,
            "package_median": 18.0,
            "package_highest": 133.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/IIT_Madras_Logo.svg/300px-IIT_Madras_Logo.svg.png",
            "description": "Ranked #1 by NIRF consistently, IIT Madras is established in 1959. Spanning a beautiful forest-like campus in Chennai, it houses India's first university-driven Research Park, fostering startup growth.",
            "cutoffs": [
                {"exam": "JEE Advanced", "branch": "Computer Science", "category": "General", "min_rank": 10, "max_rank": 85},
                {"exam": "JEE Advanced", "branch": "Electrical Engineering", "category": "General", "min_rank": 120, "max_rank": 380},
                {"exam": "JEE Advanced", "branch": "Mechanical Engineering", "category": "General", "min_rank": 600, "max_rank": 1500},
                {"exam": "JEE Advanced", "branch": "Aerospace Engineering", "category": "General", "min_rank": 800, "max_rank": 2500}
            ],
            "reviews": [
                {"reviewer_name": "Kartik G", "rating": 5.0, "text": "Best campus in India! Deer and monkeys roaming around. Excellent sports culture and academic flexibility."},
                {"reviewer_name": "Shweta K", "rating": 4.8, "text": "Very strong programming curriculum. Madras Research Park is an amazing place for start-ups."}
            ]
        },
        {
            "name": "Birla Institute of Technology and Science, Pilani (BITS Pilani)",
            "location": "Pilani, Rajasthan",
            "fees": 540000,
            "rating": 4.7,
            "courses": "B.E. Computer Science, B.E. Electronics & Communication, B.E. Electrical & Electronics, B.E. Mechanical, B.E. Chemical",
            "placements_pct": 95.0,
            "package_median": 16.2,
            "package_highest": 60.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg/300px-Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg.png",
            "description": "BITS Pilani is a highly acclaimed private deemed university. Famous for its 'Zero Attendance Policy' and 'Practice School' internship program, it selects candidates purely on BITSAT merit.",
            "cutoffs": [
                {"exam": "BITSAT", "branch": "Computer Science", "category": "General", "min_rank": 280, "max_rank": 331},
                {"exam": "BITSAT", "branch": "Electronics & Communication", "category": "General", "min_rank": 240, "max_rank": 296},
                {"exam": "BITSAT", "branch": "Electrical & Electronics", "category": "General", "min_rank": 220, "max_rank": 272},
                {"exam": "BITSAT", "branch": "Mechanical Engineering", "category": "General", "min_rank": 180, "max_rank": 223}
            ],
            "reviews": [
                {"reviewer_name": "Tanmay Bhat", "rating": 4.9, "text": "No attendance rule gives so much freedom to pursue hobbies and build products. Alumni network is strong."},
                {"reviewer_name": "Ritu Verma", "rating": 4.5, "text": "Fees are very high compared to IITs, but placement packages and campus exposure compensate fully."}
            ]
        },
        {
            "name": "National Institute of Technology, Tiruchirappalli (NIT Trichy)",
            "location": "Tiruchirappalli, Tamil Nadu",
            "fees": 150000,
            "rating": 4.6,
            "courses": "B.Tech Computer Science, B.Tech Electronics & Communication, B.Tech Electrical, B.Tech Mechanical, B.Tech Civil",
            "placements_pct": 92.8,
            "package_median": 12.0,
            "package_highest": 52.8,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/NITT_logo.svg/240px-NITT_logo.svg.png",
            "description": "NIT Trichy is ranked #1 among NITs in India. Founded in 1964, it offers premium training in technological and business studies across its 800-acre residential campus.",
            "cutoffs": [
                {"exam": "JEE Main", "branch": "Computer Science", "category": "General", "min_rank": 500, "max_rank": 4200},
                {"exam": "JEE Main", "branch": "Electronics & Communication", "category": "General", "min_rank": 2000, "max_rank": 7800},
                {"exam": "JEE Main", "branch": "Electrical Engineering", "category": "General", "min_rank": 4000, "max_rank": 12000},
                {"exam": "JEE Main", "branch": "Mechanical Engineering", "category": "General", "min_rank": 6000, "max_rank": 16000}
            ],
            "reviews": [
                {"reviewer_name": "Arun Kumar", "rating": 4.5, "text": "Brilliant coding ecosystem. Pragyan and Festember are highlights of the year. Placements are superb."},
                {"reviewer_name": "Meera Pillai", "rating": 4.7, "text": "NITT is a brand in South India. Top companies visit every year and select candidates in huge numbers."}
            ]
        },
        {
            "name": "National Institute of Technology, Surathkal (NITK)",
            "location": "Mangaluru, Karnataka",
            "fees": 155000,
            "rating": 4.5,
            "courses": "B.Tech Computer Science, B.Tech Information Technology, B.Tech Electronics & Communication, B.Tech Mechanical",
            "placements_pct": 91.5,
            "package_median": 11.5,
            "package_highest": 51.5,
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/f/ff/NITK_Logo.png",
            "description": "NITK Surathkal is uniquely positioned right next to its own private beach on the Arabian Sea. It is highly regarded as one of the best technical educational institutions in India.",
            "cutoffs": [
                {"exam": "JEE Main", "branch": "Computer Science", "category": "General", "min_rank": 800, "max_rank": 5100},
                {"exam": "JEE Main", "branch": "Information Technology", "category": "General", "min_rank": 1500, "max_rank": 6500},
                {"exam": "JEE Main", "branch": "Electronics & Communication", "category": "General", "min_rank": 3000, "max_rank": 9200},
                {"exam": "JEE Main", "branch": "Mechanical Engineering", "category": "General", "min_rank": 7000, "max_rank": 18000}
            ],
            "reviews": [
                {"reviewer_name": "Vikas Gowda", "rating": 4.8, "text": "We have a beach! Nothing compares to chilling at NITK beach after classes. Labs are top notch."},
                {"reviewer_name": "Deepa Rao", "rating": 4.2, "text": "Weather can get very hot and humid, but placements are neck-to-neck with top IITs."}
            ]
        },
        {
            "name": "Vellore Institute of Technology (VIT)",
            "location": "Vellore, Tamil Nadu",
            "fees": 240000,
            "rating": 4.2,
            "courses": "B.Tech Computer Science, B.Tech Information Technology, B.Tech Electronics & Communication, B.Tech Mechanical, B.Tech Biotechnology",
            "placements_pct": 89.0,
            "package_median": 8.0,
            "package_highest": 75.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/c/c5/Vellore_Institute_of_Technology_logo.png",
            "description": "Vellore Institute of Technology (VIT) is a renowned private research university. It features massive, state-of-the-art campuses and offers highly customizable curriculum patterns called FFCS.",
            "cutoffs": [
                {"exam": "JEE Main", "branch": "Computer Science", "category": "General", "min_rank": 10000, "max_rank": 20000},
                {"exam": "JEE Main", "branch": "Information Technology", "category": "General", "min_rank": 15000, "max_rank": 28000},
                {"exam": "JEE Main", "branch": "Electronics & Communication", "category": "General", "min_rank": 20000, "max_rank": 35000},
                {"exam": "JEE Main", "branch": "Mechanical Engineering", "category": "General", "min_rank": 30000, "max_rank": 50000}
            ],
            "reviews": [
                {"reviewer_name": "Aniket S", "rating": 4.3, "text": "FFCS allows you to choose your own teachers and slot schedules! Super modular and modern system."},
                {"reviewer_name": "Priyanshi Gupta", "rating": 4.1, "text": "Very strict hostel rules (especially in-times) and huge crowd, but infrastructure is truly state-of-the-art."}
            ]
        },
        {
            "name": "Delhi Technological University (DTU)",
            "location": "Delhi, Delhi",
            "fees": 219000,
            "rating": 4.4,
            "courses": "B.Tech Computer Science, B.Tech Software Engineering, B.Tech Electronics & Communication, B.Tech Mechanical",
            "placements_pct": 91.0,
            "package_median": 13.0,
            "package_highest": 64.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Delhi_Technological_University_logo.png",
            "description": "Formerly known as Delhi College of Engineering (DCE), DTU is one of India's oldest engineering institutions. DTU is renowned for its startup culture and massive campus placement records.",
            "cutoffs": [
                {"exam": "JEE Main", "branch": "Computer Science", "category": "General", "min_rank": 2000, "max_rank": 9800},
                {"exam": "JEE Main", "branch": "Software Engineering", "category": "General", "min_rank": 4000, "max_rank": 12000},
                {"exam": "JEE Main", "branch": "Electronics & Communication", "category": "General", "min_rank": 7000, "max_rank": 19000},
                {"exam": "JEE Main", "branch": "Mechanical Engineering", "category": "General", "min_rank": 12000, "max_rank": 29000}
            ],
            "reviews": [
                {"reviewer_name": "Gaurav Malhotra", "rating": 4.6, "text": "Excellent college life, huge campus, and amazing packages. Attendance rules are relatively relaxed compared to other institutions."},
                {"reviewer_name": "Neha Bansal", "rating": 4.2, "text": "Hostels are okayish, but the crowd is smart and we have plenty of tech teams like Defiance and Raftaar."}
            ]
        },
        {
            "name": "BITS Pilani, Hyderabad Campus",
            "location": "Hyderabad, Telangana",
            "fees": 530000,
            "rating": 4.5,
            "courses": "B.E. Computer Science, B.E. Electronics & Communication, B.E. Electrical & Electronics, B.E. Mechanical",
            "placements_pct": 94.0,
            "package_median": 15.0,
            "package_highest": 58.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg/300px-Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg.png",
            "description": "BITS Hyderabad is one of the three premier campuses of BITS Pilani. Located in Jawaharnagar, Hyderabad, it boasts a beautiful layout, high-end laboratories, and direct connections to Hyderabad's IT corridor.",
            "cutoffs": [
                {"exam": "BITSAT", "branch": "Computer Science", "category": "General", "min_rank": 250, "max_rank": 310},
                {"exam": "BITSAT", "branch": "Electronics & Communication", "category": "General", "min_rank": 220, "max_rank": 275},
                {"exam": "BITSAT", "branch": "Electrical & Electronics", "category": "General", "min_rank": 200, "max_rank": 255},
                {"exam": "BITSAT", "branch": "Mechanical Engineering", "category": "General", "min_rank": 160, "max_rank": 205}
            ],
            "reviews": [
                {"reviewer_name": "Srinivas Rao", "rating": 4.6, "text": "Amazing campus built on hills. No attendance, highly flexible course selections and amazing placement rates."},
                {"reviewer_name": "Preeti Sinha", "rating": 4.4, "text": "Super close to the Hyderabad IT hub. High fees, but the standard of education matches the primary Pilani campus."}
            ]
        },
        {
            "name": "RV College of Engineering (RVCE)",
            "location": "Bengaluru, Karnataka",
            "fees": 250000,
            "rating": 4.3,
            "courses": "B.E. Computer Science, B.E. Information Science, B.E. Electronics & Communication, B.E. Mechanical",
            "placements_pct": 92.0,
            "package_median": 9.5,
            "package_highest": 48.0,
            "logo_url": "https://upload.wikimedia.org/wikipedia/en/0/05/Rvce_logo.png",
            "description": "RVCE is a private technical college in Bengaluru. Known for being one of the top institutions under VTU/Autonomous, it is highly selective and popular due to its Bangalore location advantage.",
            "cutoffs": [
                {"exam": "JEE Main", "branch": "Computer Science", "category": "General", "min_rank": 5000, "max_rank": 15000},
                {"exam": "JEE Main", "branch": "Information Science", "category": "General", "min_rank": 8000, "max_rank": 18000},
                {"exam": "JEE Main", "branch": "Electronics & Communication", "category": "General", "min_rank": 12000, "max_rank": 24000},
                {"exam": "JEE Main", "branch": "Mechanical Engineering", "category": "General", "min_rank": 18000, "max_rank": 35000}
            ],
            "reviews": [
                {"reviewer_name": "Varun M", "rating": 4.4, "text": "Placements are insane. If you are in CS or ECE, almost all premium tech giants visit. Campus is small but active."},
                {"reviewer_name": "Tanya K", "rating": 4.2, "text": "Academic workload is high with internal tests and vivas, but it prepares you well for professional jobs."}
            ]
        }
]

from seed_data.additional_institutions_seed import ADDITIONAL_INSTITUTIONS_SEED

COLLEGES_SEED_DATA = COLLEGES_SEED_DATA + ADDITIONAL_INSTITUTIONS_SEED

