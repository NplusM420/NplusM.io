--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_profile (
    id integer NOT NULL,
    bio text NOT NULL,
    image_url character varying(500)
);


ALTER TABLE public.admin_profile OWNER TO postgres;

--
-- Name: admin_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_profile_id_seq OWNER TO postgres;

--
-- Name: admin_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_profile_id_seq OWNED BY public.admin_profile.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: blog_post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blog_post (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    image_url character varying(500),
    created_at timestamp without time zone
);


ALTER TABLE public.blog_post OWNER TO postgres;

--
-- Name: blog_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_post_id_seq OWNER TO postgres;

--
-- Name: blog_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_post_id_seq OWNED BY public.blog_post.id;


--
-- Name: contact_submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submission (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    subject character varying(200),
    message text NOT NULL,
    submitted_at timestamp without time zone
);


ALTER TABLE public.contact_submission OWNER TO postgres;

--
-- Name: contact_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submission_id_seq OWNER TO postgres;

--
-- Name: contact_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submission_id_seq OWNED BY public.contact_submission.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    image_url character varying(500),
    technologies character varying(500),
    status character varying(50),
    start_date date,
    estimated_completion date,
    progress integer,
    goals text,
    more_info text,
    link character varying(500),
    content text,
    is_current boolean DEFAULT false,
    is_featured boolean DEFAULT false
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    icon character varying(50) NOT NULL,
    features text,
    image_url character varying(500)
);


ALTER TABLE public.service OWNER TO postgres;

--
-- Name: service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_id_seq OWNER TO postgres;

--
-- Name: service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_id_seq OWNED BY public.service.id;


--
-- Name: skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skill (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    level integer NOT NULL,
    is_current boolean
);


ALTER TABLE public.skill OWNER TO postgres;

--
-- Name: skill_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skill_id_seq OWNER TO postgres;

--
-- Name: skill_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skill_id_seq OWNED BY public.skill.id;


--
-- Name: timeline_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.timeline_event (
    id integer NOT NULL,
    company character varying(100) NOT NULL,
    role character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    tasks text,
    experience text,
    link character varying(500)
);


ALTER TABLE public.timeline_event OWNER TO postgres;

--
-- Name: timeline_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.timeline_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.timeline_event_id_seq OWNER TO postgres;

--
-- Name: timeline_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.timeline_event_id_seq OWNED BY public.timeline_event.id;


--
-- Name: admin_profile id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_profile ALTER COLUMN id SET DEFAULT nextval('public.admin_profile_id_seq'::regclass);


--
-- Name: blog_post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post ALTER COLUMN id SET DEFAULT nextval('public.blog_post_id_seq'::regclass);


--
-- Name: contact_submission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission ALTER COLUMN id SET DEFAULT nextval('public.contact_submission_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: service id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service ALTER COLUMN id SET DEFAULT nextval('public.service_id_seq'::regclass);


--
-- Name: skill id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill ALTER COLUMN id SET DEFAULT nextval('public.skill_id_seq'::regclass);


--
-- Name: timeline_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_event ALTER COLUMN id SET DEFAULT nextval('public.timeline_event_id_seq'::regclass);


--
-- Data for Name: admin_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_profile (id, bio, image_url) FROM stdin;
1	As a seasoned professional in the blockchain and cryptocurrency space, I've worn many hats throughout my career. From my early days as a community manager and educator to founding and advising numerous projects, I've developed a deep understanding of the web3 ecosystem. My expertise spans from technical aspects like smart contract development and tokenomics to softer skills such as community building and strategic planning.\r\nI'm particularly passionate about leveraging emerging technologies like AI to create innovative solutions. Whether it's developing AI-powered trading tools, crafting intricate storytelling experiences, or building educational platforms, I'm always looking for ways to push the boundaries of what's possible in the digital realm.\r\nMy journey has taken me from managing trading communities to advising high-profile NFT projects like 0n1 Force. I've founded companies focused on crypto education and AI integration, and I'm currently working on cutting-edge projects in the AI and content creation space.\r\nWith a skill set that includes creative strategy, project management, and technical documentation, I bring a unique blend of creativity and analytical thinking to every project. I'm driven by the desire to innovate, educate, and build communities around transformative technologies.	/static/profile_images/NicholasMassey.png
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
0f5e46abe496
\.


--
-- Data for Name: blog_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_post (id, title, content, image_url, created_at) FROM stdin;
\.


--
-- Data for Name: contact_submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submission (id, name, email, subject, message, submitted_at) FROM stdin;
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (id, title, description, image_url, technologies, status, start_date, estimated_completion, progress, goals, more_info, link, content, is_current, is_featured) FROM stdin;
14	TraderWiz	Create an intuitive AI bot to analyze Stocks and Cryptocurrencies in multiple ways.	/Images/Projects/14_TraderWiz.png	AI, Financial Analysis, Discord Bot	Working	2023-03-01	2023-03-31	100	Create an intuitive AI bot to analyze Stocks and Cryptocurrencies in multiple ways.	This was just a weekend project that turned out to be functional. I create an agent that analyzes different tickers and does research on companies to analyze their fundamental and technical data, track performance ratings, and give price predictions based on collected data.	\N	D:\\Projects\\Discord Bots\\TraderWiz	f	f
11	AI Nicholas	Create an intelligent AI that is trained to act exactly like myself.	/Images/Projects/11_NicholasMassey.png	AI, Machine Learning	Unfinished	2023-01-01	\N	50	Create an intelligent AI that is trained to act exactly like myself.	I mean who doesn't want an AI version of themselves. Pssh.	\N	\N	f	f
10	Art3m1s	Create a fully interactive character utilizing the owned IP of an NFT from 0n1 Force (#1870), complete with story, character arc, custom AI agent with text-to-speech and speech-to-text integrations.	/Images/Projects/10_Art3m1sSitting.png	AI, NFT, Storytelling	Finished	2022-01-01	2022-06-01	100	Create a fully interactive character utilizing the owned IP of an NFT from 0n1 Force (#1870), complete with story, character arc, custom AI agent with text-to-speech and speech-to-text integrations.	I wanted to give my 0n1 life by writing a detailed story giving him deep backstory and lore. Basing this lore off the official 0n1 Force story, I was able to create my own example of what the 0n1 world would look like through my characters eyes, and give that character the powers of AI to give us a glimpse at that experience.	\N	D:\\Projects\\Art3m1s\\Images - D:\\Projects\\Art3m1s\\The Ballad of Art3m1s.txt	f	t
13	Snappy	A Discord bot with AI art generation and editing abilities.	/Images/Projects/13_SnappyPFP.png	Discord Bot, AI, Image Processing	Finished Beta build	2022-09-01	2023-03-01	90	A Discord bot with AI art generation and editing abilities.	Snappy started as a challenge to see if I could build a discord bot that utilized certain image generation tools. Once I figured that out I just kept adding tools and features. Snappy can generate an image from most OpenSource AI art models, it has tools to allow you to easily upscale, re-theme, remove background, replace images in objects, convert to video, and convert to gifs. All packaged into a pleasantly branded Discord bot experience.	\N	D:\\Projects\\Discord Bots\\SnappyV3.0	t	t
12	Cosmic Courier	Create a unique endless runner with fun play-styles to release to various web3 projects.	path/to/image	Game Development, Web3	Ideation stage	2023-06-01	\N	10	Create a unique endless runner with fun play-styles to release to various web3 projects.	I mainly wanted to see what my own skills would look like when applied to building a game. The idea seems easy enough to build an endless runner game with a deeper level of user engagement through custom branded IP, missions, and gaming league involvement.	\N	D:\\Projects\\Cosmic Courier	f	f
17	FDA	A customized AI assistant designed to optimize the workflow and experience for rideshare/delivery services.	path/to/image	AI, Workflow Optimization, Mobile App Development	Pending	2023-05-01	\N	30	A customized AI assistant designed to optimize the workflow and experience for rideshare/delivery services.	I can't say much about this until my team decides what we are doing with the idea. This could save rideshare workers a lot of time and teach them how to make more from the job they're already working.	\N	Restricted	f	f
19	RiffRipper	An easy to use tool to auto-extract zip files and place them in target directories.	path/to/image	Python, GUI Development, File Management	Finished Beta Launched	2022-07-01	2022-08-31	100	An easy to use tool to auto-extract zip files and place them in target directories.	This was the very first tool I built and publicly published. I was extracting 100+ zip files for CloneHero songs and realized that there had to be a faster way. So I started working on a script that would extract the files and put them in my /Songs folder for me. Then I decided the rest of the CloneHero community might also like this tool so I built a GUI for it, added multi-threading support, duplication checkers, and auto-delete and decided to take it public.	https://github.com/NplusM420/RiffRipper	D:\\Projects\\RiffRipper	f	f
20	SongSmith	Enable users to upload music files to be processed into playable CloneHero songs.	path/to/image	AI, Music Processing, Game Development	Not Started	\N	\N	0	Enable users to upload music files to be processed into playable CloneHero songs.	This was a bit ambitious for the timing of when I came up with it. But the idea is to upload music of your choosing and allow the AI to process the song into a .midi format and produce accurate charts to play. Letting any song be turned into a gaming experience seamlessly.	\N	\N	f	f
15	VolBot	Create an easy to use interface to track the global marketcap volume in crypto on various time basis points.	path/to/image	Discord Bot, Cryptocurrency, Data Analysis	Working	2023-02-01	2023-02-28	100	Create an easy to use interface to track the global marketcap volume in crypto on various time basis points.	I just really needed to track the marketcap info in a way that let me see real time changes easier. This script worked, so I packaged it into a discord bot with the intent of letting it run in its own channel for reference at any time.	\N	D:\\Projects\\Discord Bots\\VolBot	f	t
16	DreamWeaver	A bedtime story generation app designed to give parents the ability to custom tailor their child's stories to familiar and specific requests.	path/to/image	AI, Natural Language Processing, Mobile App Development	Unfinished Alpha stage	2022-11-01	\N	60	A bedtime story generation app designed to give parents the ability to custom tailor their child's stories to familiar and specific requests.	This was one of the first ideas I had for building with AI, I wanted to build an agent that simply crafted stories for bedtime using keywords. I had about 60% of the code finished when the first app of its kind hit the market. I quickly moved on to another idea.	\N	\N	f	f
18	Project Cur8t0r	A hyper-intelligent AI focused on guiding the curation of multi-layered storytelling experiences.	path/to/image	AI, Storytelling, Content Curation	Alpha	2023-04-01	\N	40	A hyper-intelligent AI focused on guiding the curation of multi-layered storytelling experiences.	This is one of my ideas I smile about when I imagine it being a reality. The goal of the Cur8t0r is to provide users with the needed tools to design their own characters and stories, and then directly integrate them into existing stories and character use of others in a shared network of growing depth. With many many layers of cross-auditing for accuracy across stories and future ideation.	\N	\N	t	t
24	Lemonati - Artemis	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/jessicamore180?igsh=NTkwZzlkb2M3aG9i) into the story as a unique character.	/Images/Projects/24_artyBALL3.png	NFT, Storytelling, Character Development	Unreleased	2023-08-01	\N	60	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/jessicamore180?igsh=NTkwZzlkb2M3aG9i) into the story as a unique character.	Think of this as an expansion pack for an already existing massive NFT and marketing production.	\N	https://drive.google.com/drive/u/2/folders/1qn__1KFLlbtblikuy-K7Je0yniFPr3oZ	t	f
23	Lemonati - Persephone	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/poly_cypress?igsh=djcyMG9jZ2JpYXli) into the story as a unique character.	/Images/Projects/23_PerceyExample.png	NFT, Storytelling, Character Development	Unreleased	2023-07-01	\N	65	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/poly_cypress?igsh=djcyMG9jZ2JpYXli) into the story as a unique character.	Think of this as an expansion pack for an already existing massive NFT and marketing production.	\N	https://drive.google.com/drive/u/2/folders/1FHfw1XiPgG9BB2PlZJxplIlW4vGOejEl	t	f
21	Lemonati	Create an NFT collection complete with story, lore, marketing strategies, and scaling solutions.	/Images/Projects/21_MidnightPartySeries64.png	NFT, Storytelling, Marketing	Unreleased	2023-01-01	\N	80	Create an NFT collection complete with story, lore, marketing strategies, and scaling solutions.	This is one of my biggest projects to date, spanning 20,000+ images generated, 300+ different evolutions of story chapters, and many stressful nights thinking about the big picture of it all. This storytelling experience is rooted in the allure of mystery and ambition.	\N	D:\\AI Content Creation\\Lemonati - https://drive.google.com/drive/u/2/folders/1FoDfppoAvWDWb-QGdER8Yt_MHUiefBfq - D:\\AI Content Creation\\Lemonati\\Lemonati Series NFTs	t	t
22	Lemonati - Aurora	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/liveandsetsail?igsh=MXN5bzN4NXBzbjFxcQ==) into the story as a unique character.	/Images/Projects/22_auryAMULET.png	NFT, Storytelling, Character Development	Unreleased	2023-06-01	\N	70	Create an expanded story built on top of the Lemonati series, focused on integrating (https://www.instagram.com/liveandsetsail?igsh=MXN5bzN4NXBzbjFxcQ==) into the story as a unique character.	Think of this as an expansion pack for an already existing massive NFT and marketing production.	\N	https://drive.google.com/drive/u/2/folders/1vXxuxuFHtEfPlFVqYz6GGKXdcYB9ke5e	t	f
26	Misc. Music	Create cool songs and video with AI	path/to/image	AI, Music Generation, Video Generation	Sitting in my drive	2023-01-01	\N	100	Create cool songs and video with AI	This is just a random assortment of AI generated music and videos I've produced.	\N	D:\\AI Content Creation\\6079\\Art Comp\\Audio - D:\\AI Content Creation\\Santas Workshop\\Video\\Finish - D:\\AI Content Creation\\Bday Party\\Video	f	f
25	Gaze	Push the boundaries of detail through AI art	/Images/Projects/25_GazeEntry.png	AI, Art Generation	Unreleased	2023-09-01	\N	90	Push the boundaries of detail through AI art	I didn't want to just create a bunch of images and slap the term "Art Project" on it. I wanted something deeper from this experience. I opted to instead create 10 different "Core" themes in this project. Each theme is generated in MANY different variations of styles, and each style has 2 copies of that scene. With 333 images created, the intended effect was to have the viewer simply want to stop and stare at the images intently focusing on the detailing that comes through in each of them. And thus the name, Gaze.	\N	D:\\AI Content Creation\\Art Project	t	t
27	Amber Inwood	Create a production ready AI influencer for various marketing and content generation needs.	/Images/Projects/27_nplusm__aad74f7a-57e2-430d-a024-4563872ae4fc.png	AI, Content Creation, Digital Influencer	Training	2023-10-01	\N	40	Create a production ready AI influencer for various marketing and content generation needs.	This was my first attempt at creating my own AI influencer, having trained dozens of LoRa models and creating character consistency in other projects, I felt it beneficial to create my own blank character that could be used whenever needed. And yes her initials are AI…	\N	D:\\AI Content Creation\\AI Influencers\\Amber Inwood\\Images\\Training Data\\Raw - Enhanced	f	f
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service (id, title, description, icon, features, image_url) FROM stdin;
1	Website Development	Basic custom website development tailored to your needs, with varying levels of AI integrations. 	🌐	["{\\"Responsive Design\\"", "\\"SEO Optimization\\"", "\\"Custom CMS\\"}"]	\N
2	Discord Bot Development	Let's work together to create a unique and creative Discord bot. Use different AI tools via API, integrate events, gaming, security or admin features. What do you need next?	🌐	{"AI Chatbots","Admin Security","Interactive Gaming","AI art solutions","API integrations of many kinds!!!"}	\N
3	NFT ART & STORY/LORE	Have a vision for a new art project? Or maybe you want to put together a community and not sure how. Let's work together to create a unique display of art and creativity and immortalize that forever on the blockchain! \n\nWith a deep story-telling experience to bring your art to life, your holders will feel more engaged and involved with every release! 	🌐	[]	
4	AI SOLUTIONS 	Looking to integrate AI into your workplace or company? Let's discuss your level of needs and what you want to apply the AI towards, or at the least I can present some ideas based on due diligence into your company. 	🌐	[]	
\.


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skill (id, name, level, is_current) FROM stdin;
2	Web3 Education	100	t
3	HTML	75	t
4	AI Solutions	95	t
5	Creativity & Innovation	100	t
6	Team Management	80	t
7	Technical Documentation	70	t
8	Market Research	85	t
9	Community Management	100	t
1	Python	70	t
10	Creative Strategy	100	t
11	Digital Storytelling	100	t
12	Business Development	70	t
13	Networking	90	t
\.


--
-- Data for Name: timeline_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timeline_event (id, company, role, start_date, end_date, tasks, experience, link) FROM stdin;
1	Sippycup Trading	Director of Expansion	2017-01-01	2018-07-31	Marketing, Partnerships, Community Growth	At Sippycup, I found a new love for trading in markets. Starting with stocks and quickly learning how to navigate the atmosphere. I began pursuing my knowledge in crypto during this time, later becoming the go to source of information for thousands. Learning the foundations of marketing and community management, I grew this community to 3000+ members of organic traders.	\N
2	SmileBack Media	CEO	2018-07-01	2022-09-30	Teach high quality educational content in web3, build a community, scale network effect	SmileBack was my first venture into the world of Founder. I created my own educational trading community where we amassed 3000+ members with hundreds active daily. We held weekly stock and crypto classes and voice chats. This was an extremely fun learning experience being in charge of so many moving pieces and keeping a community moving forward.	\N
3	Beacon	Advisor	2017-10-01	2020-08-31	Strategic ideation	Beacon was one of my earliest Advisor experiences, It was here I learned the fundamentals of launching, maintaining, and scaling a blockchain project. We focused on building a novel masternode community coin. We were acquired by "DECENOMY".	https://www.coingecko.com/en/coins/beacon
4	Atomic Bazaar	Community Manager	2017-10-01	2018-07-31	Create fun and engaging experience for community members	Dan and Jomessin from AB are some incredibly talented people. This was an underrated project through and through. The community didn't grow very large but we had a lot of fun learning what people reacted to best. This company was very quickly acquired by OpenSea for some of the smart contract services we offered (first mutli-erc20 TX in single sends).	\N
5	Block Duelers	Advisor	2018-12-01	2020-12-31	Creative Ideation	Block Duelers was ahead of it's time all in all. We were building an NFT based trading card game with various fighting characters and betting mechanics. Launching this during the bear market was a rookie mistake, lesson learned.	\N
6	Fyre Network	Advisor	2020-12-01	2021-02-28	Tokenomics and Strategic merger planning	This was a mess, but still something to learn from. We went into this project with 5 separate Masternode coin projects looking to merge into a single massive community. Each with varying tokenomics and community size. It was a nightmare to run the numbers determining a fair distribution and adequate go-to-market strategies. It was a fighting chance to salvage a lot of lost effort that in the end shut down quickly.	\N
7	0n1 Force	Advisor	2022-04-01	\N	Strategic Ideation, AI solutions, Community solutions, Web3 Solutions	0n1 Force has been one of the most fun communities to be a part of. With $250mil+ in sales since inception, the project has generated massive interest from hundreds of thousands of people. This continues to shape up to be one of the most impressive anime/gaming web3 communities out there.	https://www.0n1force.com/
8	GM Labs	Founder	2022-08-01	\N	AI and NFT scaling solutions, stressing like a CEO	During the early days of AI advancement, I saw an opportunity to create something special. This project holds a lot of sentimental value to me. Using many different layers of AI, my team and I began crafting a dynamically unique storytelling experience that was reactionary based lore from one of the largest NFT community projects out (10ktf). We published weekly lore updates, nearly daily community events continuing the story and depth of the experience. This project has fallen to the backburner a bit as the markets unfolded and some internal team issues began to arise. Mark my words, these creatures will roam the tunnels again.	https://x.com/doctorgmoon
9	Impressum Trading	CEO	2022-09-01	2024-07-31	Educator, Founder, Dev	Impressum Trading was my first officially launched company, I focused on using my extensive web3 educational background to create an easy to follow and engaging learning experience. Having spent more than 20,000 hours studying projects, markets, and charts as a whole. I leveraged this to provide a deep level of insight into nearly all market actions. We also offered web3 services such as NFT and erc20 contract creation and launching. As well as some art focused services building NFT collections.	\N
10	Delta Trading Group	Crypto Educator	2021-04-01	2022-09-30	Educator, Course Curator	This was one of the most stressful experiences I've had in this space to date. Having hundreds of students under my wing of "Crypto Education" in this company, I curated and taught 3 classes per week often lasting 2 hours each. Curating each class to simplified terms among some of the most complicated technology aspect in the industry. After hundreds of recorded classes we were able to create an incredibly thorough educational course for students to follow in short form content.	\N
11	InnerCircle Alpha	CEO	2023-01-01	2023-09-30	Crypto Educator, Alpha curator	This was a really fun chance to showcase how thorough my research into various projects can get. I created a private/invite-only NFT alpha group focused on research each project being spotlighted in excruciating detail, and proceeding to have hosted discussions about these projects. This group was incredibly successful as traders, having many traders earn well over 100x gains in their time.	\N
12	LemonSocial	Business Development	2023-03-01	\N	Web3 and AI integrations, NFT/Lore/Coin curation	At LemonSocial, we offer content creators a platform to not only earn more from their content than others, but have a sense of security knowing that we are built with the creator in mind. Integrating AI and Crypto into the platform deeply, we aim to offer a lasting solution to content distribution for creators everywhere. I've personally created a full book dedicated to the Lore of this project, complete with an NFT collection, and 3 separate "expansion" collections + books.	https://lemonsocial.com/
13	AI Layer Labs	Mod/Dev	2024-04-01	\N	Discord moderation, Bot Development	AI Layer Labs has created the "6079ai" protocol that is pioneering the "Proof-of-Inference" model. For this reason, we have amassed a large consortium of 25+ projects focused on accelerating Open-Sourced AI methodologies. We are building the largest and most advanced decentralized network of secure AI protocols. And I get to build some really cool bots using these tools :)	https://6079.ai/?ref=AO1V6SIS
\.


--
-- Name: admin_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_profile_id_seq', 1, true);


--
-- Name: blog_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_post_id_seq', 1, false);


--
-- Name: contact_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_submission_id_seq', 1, false);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_id_seq', 27, true);


--
-- Name: service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_id_seq', 4, true);


--
-- Name: skill_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skill_id_seq', 13, true);


--
-- Name: timeline_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timeline_event_id_seq', 13, true);


--
-- Name: admin_profile admin_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_profile
    ADD CONSTRAINT admin_profile_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: blog_post blog_post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_post
    ADD CONSTRAINT blog_post_pkey PRIMARY KEY (id);


--
-- Name: contact_submission contact_submission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submission
    ADD CONSTRAINT contact_submission_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (id);


--
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (id);


--
-- Name: timeline_event timeline_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.timeline_event
    ADD CONSTRAINT timeline_event_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

