export type Language = 'ko' | 'en';

export interface AnalysisResult {
  introMessage: string;
  studentId: {
    studentType: string;
    department: string;
    keyTraits: string[];
    reason: string;
    bottomLine: string;
  };
}

export type AppStep = 'intro' | 'capture' | 'analyzing' | 'result' | 'error';

export interface DepartmentInfo {
  name: string;
  englishName: string;
  url: string;
  description: string;
  descriptionEn: string;
}

export const DEPARTMENT_DATA: DepartmentInfo[] = [
  {
    name: "수학과",
    englishName: "Mathematics",
    url: "https://math.postech.ac.kr/",
    description: "첨단기술의 기초가 되는 인간의 원초적 특성 수학적 사고를 통해 4차 산업혁명의 중심으로, 수학적 사고는 예술이나 음악과 같은 인간의 원초적 특성입니다. 인공지능, IoT, 빅데이터, 블록체인 등 새롭게 등장하는 기술 혁신도 근본적으로 수학을 응용하고 개발하는 데 기초를 두고 있습니다.",
    descriptionEn: "Mathematical thinking is a primal human trait that forms the basis of advanced technology. From AI to Blockchain, innovation is rooted in mathematics."
  },
  {
    name: "물리학과",
    englishName: "Physics",
    url: "https://ph.postech.ac.kr/physics/index.do",
    description: "양자정보, 나노기술, 생명과학 등 세계 물리학 연구를 선도하는 인재들의 집합소. 우주와 자연에 나타나는 다양한 현상의 근본 원리를 탐구하며, 양자정보, 나노기술, 생명과학 등 다양한 최신 과학 공학의 연구에 기초를 제공하는 중요한 학문입니다.",
    descriptionEn: "A hub for leaders in Quantum Info, Nano-tech, and Bio-science. We explore the fundamental principles of the universe and provide the basis for cutting-edge engineering."
  },
  {
    name: "화학과",
    englishName: "Chemistry",
    url: "https://chem.postech.ac.kr/",
    description: "의약품, 신소재, 에너지 등 인류 복지와 직결되는 학문. 물질의 구조와 성질을 규명하고 변환을 통한 새로운 물질 창조의 과정을 연구합니다. 미래 전자공학, 생명과학의 무한한 가능성을 뒷받침하고 있습니다.",
    descriptionEn: "Directly linked to human welfare: Medicine, New Materials, Energy. We research the structure of matter and the creation of new substances."
  },
  {
    name: "생명과학과",
    englishName: "Life Sciences",
    url: "https://life.postech.ac.kr/",
    description: "유수 프로젝트의 지원, 국내 최고 수준의 연구팀이 모인 혁신의 용광로. 세계적 수준의 연구와 차별화된 교육을 통해 생명과학 분야에서 독보적인 경쟁력을 자랑합니다. 창의적이고 진취적인 연구 인재를 양성하며 세계 학계를 선도합니다.",
    descriptionEn: "A melting pot of innovation with world-class research teams. We foster creative global leaders through advanced research and specialized education."
  },
  {
    name: "신소재공학과",
    englishName: "Materials Science & Engineering",
    url: "https://mse.postech.ac.kr/",
    description: "더 가볍게 더 기능적으로 정보, 환경, 바이오 재료 분야를 아우르는 경쟁력. 새로운 소재를 개발하고 소재의 기능을 높여 부품을 가볍게 만들고, 시간과 에너지를 혁신적으로 줄이는 데 일조했습니다.",
    descriptionEn: "Lighter, more functional materials for Info, Bio, and Environment. We innovate to reduce energy consumption and create high-performance materials."
  },
  {
    name: "기계공학과",
    englishName: "Mechanical Engineering",
    url: "https://me.postech.ac.kr/",
    description: "우수연구센터 첨단유체공학연구센터를 비롯해 10개의 국가지정 연구실 유치에 빛나는 독보적인 학문 경쟁력. 에너지, 로봇, 수송수단, 우주/해양기술 등 인류 생활에 기여하는 광범위한 영역을 연구합니다.",
    descriptionEn: "Unrivaled academic competitiveness with top research centers. From robotics to aerospace, we cover broad areas contributing to human life."
  },
  {
    name: "산업경영공학과",
    englishName: "Industrial & Management Engineering",
    url: "https://ime.postech.ac.kr/ime/index.do",
    description: "전통적 산업공학의 기반 위에 경영을 더해 시스템 통합 및 최적화, 패러다임의 변화를 이끌다. 생산성 향상 및 삶의 질 향상을 우선으로 하는 산업 환경 조성을 위한 미래지향적 학문입니다.",
    descriptionEn: "Leading paradigm shifts by adding management to industrial engineering. We focus on system optimization and integration for a better future."
  },
  {
    name: "전자전기공학과",
    englishName: "Electrical Engineering",
    url: "https://ee.postech.ac.kr/",
    description: "지능형 디바이스 등 첨단과학기술 동향에 발맞추어 고부가가치 산업을 육성하는 소수 정예의 선도적 연구. 정보화와 융복합화가 급속도로 진행되고 있는 세계적 추세에 따라 창의적 고부가가치 산업 육성을 지향합니다.",
    descriptionEn: "Leading research for high-value industries and intelligent devices. We foster creative talents to lead the global trend of information and convergence."
  },
  {
    name: "컴퓨터공학과",
    englishName: "Computer Science & Engineering",
    url: "https://cse.postech.ac.kr/csepostech/index.do",
    description: "인류의 삶을 편리하고 풍요롭게 만드는 정보처리와 인공지능을 연구하는 첨단 학문. 정보의 생성, 저장, 가공, 관리 및 효율적 배포를 위한 기본원리와 응용을 다루며 21세기 정보화 사회를 이끄는 핵심입니다.",
    descriptionEn: "Cutting-edge study of information processing and AI for a better life. The core of the 21st-century information society, covering basics to advanced applications."
  },
  {
    name: "화학공학과",
    englishName: "Chemical Engineering",
    url: "https://ce.postech.ac.kr/",
    description: "에너지/환경기술, 생명공학기술, 정보통신기술 등으로 대표되는 미래융합기술 산업으로 진화하고 있습니다. 수학, 물리, 화학, 생물 등 과학의 모든 분야를 망라하는 복합지식을 갖춘 인재를 양성합니다.",
    descriptionEn: "Evolving into future convergence technologies like energy, environment, and bio-tech. We cultivate talents with comprehensive knowledge in math and science."
  },
  {
    name: "IT융합공학과",
    englishName: "Convergence IT Engineering",
    url: "https://cite.postech.ac.kr/",
    description: "창의적 상상력, 융합적 탐구, 혁신적 창조를 통해 세계 최고 수준의 인재로 거듭나는 곳. 자기 주도적이고 도전적인 문제해결 역량을 갖춘 세계 최고 수준의 인재육성을 목표로 하고 있습니다.",
    descriptionEn: "Becoming world-class talents through creative imagination and convergence. We aim to foster self-directed problem solvers."
  },
  {
    name: "반도체공학과",
    englishName: "Semiconductor Engineering",
    url: "https://semi.postech.ac.kr/semi/index.do",
    description: "우리나라 반도체산업을 지키는 최고의 공학 인재를 위한 곳. 재료, 소자, 공정, 설계를 포함한 반도체 전 분야의 기초 및 응용지식을 바탕으로 최고의 공학 인재를 양성합니다.",
    descriptionEn: "The best place for engineering talents guarding the semiconductor industry. We nurture global leaders with knowledge in materials, devices, and design."
  },
  {
    name: "환경공학부",
    englishName: "Division of Environmental Science & Engineering",
    url: "https://dese.postech.ac.kr/",
    description: "글로벌 환경난제 해결을 목표로 연구하고 교육합니다. 기후변화 및 미세먼지, 전지구적 물질 순환, 물순환 및 수처리 기술, 친환경 소재 개발 등 4가지 핵심 분야에 집중하고 있습니다.",
    descriptionEn: "Researching to solve global environmental challenges. Focusing on climate change, material cycle, water cycle, and eco-friendly materials."
  },
  {
    name: "인공지능대학원",
    englishName: "Graduate School of Artificial Intelligence",
    url: "https://ai.postech.ac.kr/",
    description: "2019년 정부 지원하에 설립 인공지능 핵심 분야의 창의적 인재 양성. 미디어 AI, 데이터 AI, AI이론 분야를 중심으로 연구하며 전문 지식과 산업적 감각을 두루 갖춘 창의적인 인재를 양성합니다.",
    descriptionEn: "Fostering creative talents in core AI fields. Focusing on Media AI, Data AI, and AI Theory with industrial insights."
  },
  {
    name: "첨단원자력공학부",
    englishName: "Division of Advanced Nuclear Engineering",
    url: "https://dane.postech.ac.kr/",
    description: "국제적 감각과 리더십을 배양하는 지식과 지성의 터전. 원자력의 선도적 개발과 안정적인 공급 및 관리, 원자력 폐기물의 효율적 처분 등 포괄적 기술 과학을 연구합니다.",
    descriptionEn: "A ground for knowledge and intellect fostering global leadership. Leading future nuclear technology and safe energy supply."
  },
  {
    name: "친환경소재학과",
    englishName: "Ferrous & Eco Materials Technology",
    url: "https://gift.postech.ac.kr/",
    description: "친환경제철, 차세대 철강제품을 다루는 세계 유일의 전문 교육기관. 철강을 중심으로 한 환경친화형 소재 산업의 발전을 이끌 인력을 양성하고 혁신 기술을 개발합니다.",
    descriptionEn: "World's only specialized institution for eco-friendly steel and materials. Developing innovative technologies for the national economy."
  },
  {
    name: "배터리공학과",
    englishName: "Department of Battery Engineering",
    url: "http://nesp.postech.ac.kr/",
    description: "산업통상자원부 인가 특성화 대학원 지속 가능한 에너지 솔루션 연구의 터전. 전기차, 휴대용 전자기기 등 미래 에너지 체계에서 핵심적인 리튬이온 이차전지 및 차세대 전지 시스템을 연구합니다.",
    descriptionEn: "Hub for sustainable energy solution research. Focusing on next-gen battery systems like lithium-ion for EVs and portable devices."
  },
  {
    name: "정보통신대학원",
    englishName: "Graduate School of Information Technology",
    url: "https://gsit.postech.ac.kr/",
    description: "소수정예의 강도 높은 교육을 통해 국가 차원의 정보산업 첨단 인력 양성. 21세기 산업을 주도할 정보통신 부문의 인력 부족을 해소하고, 국가적 차원에서 정보산업의 첨단기술을 확보합니다.",
    descriptionEn: "Training advanced personnel for the national information industry. Intensive education for a select few to lead 21st-century IT."
  },
  {
    name: "시스템생명공학부",
    englishName: "Division of Interdisciplinary Bioscience & Bioengineering",
    url: "https://ibio.postech.ac.kr/web/",
    description: "기초과학과 응용과학을 아우르는 최첨단 생명공학 연구를 선도. 기초과학과 응용과학의 지식과 기술을 융합한 새로운 생명공학 연구를 통해 미래지향적 과학자 및 기술 인재를 육성합니다.",
    descriptionEn: "Leading cutting-edge bio-engineering merging basic and applied sciences. Fostering future-oriented scientists."
  },
  {
    name: "첨단재료과학부",
    englishName: "Division of Advanced Materials Science",
    url: "https://ams.postech.ac.kr/web/",
    description: "융복합 교육 인프라, 산학연 연계로 실무적 AI-첨단소재 연구. 인공지능 및 첨단소재과학의 융복합 교육 인프라 구축, 산학연 연계를 통한 실무적 AI-첨단소재 연구인력 양성을 목표로 합니다.",
    descriptionEn: "Practical AI-Advanced Materials research via convergence education. Building infrastructure for AI and materials science integration."
  }
];