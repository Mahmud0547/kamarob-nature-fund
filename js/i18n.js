/**
 * i18n.js — Kamarob Nature Fund
 * 4-language support: English, Russian, German, Tajik
 * Usage: window.i18n.setLang('ru') | window.i18n.t('hero.title')
 */

const TRANSLATIONS = {

  en: {
    nav: {
      mission: "Mission",
      programs: "Programs",
      about: "About",
      gallery: "Gallery",
      expeditions: "Expeditions",
      contact: "Contact Us",
      login: "Login",
      dashboard: "Dashboard",
      admin: "Admin Panel",
      logout: "Logout"
    },
    hero: {
      tag: "Rasht Valley, Tajikistan · 3,000 m",
      title: "Protect the <em>Highlands.</em><br>Restore the Future.",
      sub: "We work in the Kamarob Gorge — one of Central Asia's last pristine mountain ecosystems — to preserve clean water, protect forests, and empower local communities.",
      btn_programs: "Our Programs",
      btn_involve: "Get Involved"
    },
    stats: {
      trees: "Trees Planted",
      land: "Protected Land",
      villages: "Partner Villages",
      volunteers: "Active Volunteers"
    },
    mission: {
      tag: "Why We Exist",
      title: "The <em>Kamarob Gorge</em> needs a voice.",
      p1: "The Rasht Valley stretches through the heart of Tajikistan — a landscape of glacial streams, ancient juniper forests, and nomadic paths that have existed for thousands of years. Climate change and deforestation are erasing them within decades.",
      p2: "Kamarob Nature Fund was founded by people who walked these mountains, drank from these springs, and refused to watch in silence.",
      quote: "\"When you climb 3 km above Shukmak village and see the gorge from above, you understand — this cannot disappear.\"",
      p1_forest: "Forest Restoration",
      d1_forest: "Replanting native juniper and walnut species across degraded slopes in the Kamarob watershed.",
      p2_water: "Clean Water Access",
      d2_water: "Protecting mountain springs and stream corridors that supply 48 villages with drinking water.",
      p3_wild: "Wildlife Corridors",
      d3_wild: "Mapping migration routes for snow leopards, Marco Polo sheep, and golden eagles.",
      p4_comm: "Community Empowerment",
      d4_comm: "Training local rangers and creating sustainable ecotourism routes that generate income without destruction."
    },
    programs: {
      tag: "Active Programs",
      title: "What We <em>Do</em>",
      p1_badge: "Water",
      p1_title: "Shukmak Spring Network",
      p1_desc: "We map, test, and protect 17 natural springs above Shukmak village. Annual water quality reports are shared with local government and international partners.",
      p2_badge: "Forests",
      p2_title: "Highland Reforestation",
      p2_desc: "Every spring and autumn, volunteers climb to 2,500–3,000 m to plant native saplings. Over 12,000 trees planted since 2021.",
      p3_badge: "Ecotourism",
      p3_title: "Kamarob Trail Project",
      p3_desc: "We're developing marked hiking trails through the gorge — working with local families on guesthouses, guides, and leave-no-trace practices."
    },
    about: {
      tag: "Our Story",
      title: "Born from a <em>3 km climb</em>.",
      p1: "In the summer of 2023, a small group of friends from Dushanbe hiked to a ridge above Shukmak village in the Rasht District. They brought water from a natural spring, ate wild berries, and watched a golden eagle circle below them.",
      p2: "They also saw burned hillsides, a dried streambed that locals said \"used to run all summer,\" and plastic litter three hours from the nearest road. That contradiction became the foundation of this organization.",
      p3: "Today our core team of 12 works year-round with 320 volunteers from 8 countries to protect 3,200 hectares of highland terrain in the Kamarob watershed.",
      quote: "\"We don't come from NGO offices. We come from these valleys. That's the difference.\"",
      btn: "Join Our Team →"
    },
    gallery: {
      tag: "From the Field",
      title: "The <em>Mountains</em> We Protect"
    },
    expeditions: {
      tag: "Field Missions",
      title: "Our <em>Expeditions</em>",
      sub: "Every year we organize research and restoration expeditions into the Kamarob highlands. Here are our most recent missions.",
      no_results: "No expeditions published yet.",
      location: "Location",
      elevation: "Elevation",
      date: "Date",
      read_more: "Read More →"
    },
    involve: {
      tag: "Take Action",
      title: "Be Part of the <em>Solution</em>",
      c1_title: "Volunteer With Us",
      c1_desc: "Join our seasonal planting expeditions in the Kamarob highlands. No experience required — only a willingness to climb, dig, and care. Food and accommodation provided.",
      c1_btn: "Apply to Volunteer",
      c2_title: "Partner or Fund",
      c2_desc: "We partner with organizations, governments, and companies that share our values. Transparent financial reporting for all major donors.",
      c2_btn: "Become a Partner"
    },
    contact: {
      tag: "Get In Touch",
      title: "Let's <em>Talk</em>.",
      sub: "Whether you want to volunteer, partner, or just learn more about the Kamarob — we'd love to hear from you.",
      address: "Dushanbe, Republic of Tajikistan",
      field_missions: "Field missions: April – October",
      security_title: "Secure Form",
      security_desc: "Protected against spam, XSS injection, and data tampering. No personal data stored on our servers.",
      label_name: "Full Name",
      label_email: "Email",
      label_subject: "I'm interested in",
      label_msg: "Message",
      opt_vol: "Volunteering on a field mission",
      opt_partner: "Institutional partnership",
      opt_fund: "Funding / Grant",
      opt_media: "Media / Press",
      opt_other: "Other",
      ph_name: "Your name",
      ph_email: "you@example.com",
      ph_msg: "Tell us about yourself and how you'd like to get involved…",
      btn_send: "Send Message",
      btn_sending: "Sending…",
      success: "✅ Thank you! We'll be in touch within 48 hours.",
      error: "❌ Send failed. Please email info@kamarobnature.org",
      err_name: "Please enter your name.",
      err_email: "Please enter a valid email address.",
      err_msg: "Message is too short.",
      err_rate: "Too many submissions. Please wait an hour and try again."
    },
    footer: {
      desc: "Protecting the highlands of Tajikistan's Rasht Valley — for the people who live there and the ecosystems that sustain all of us.",
      col1: "Programs",
      col2: "Organization",
      rights: "© 2026 Kamarob Nature Fund. All rights reserved.",
      dev: "Website by"
    },
    auth: {
      login_title: "Welcome back",
      login_sub: "Sign in to your Kamarob account",
      register_title: "Join the mission",
      register_sub: "Create a free account to follow our work",
      label_name: "Full Name",
      label_email: "Email Address",
      label_password: "Password",
      label_confirm: "Confirm Password",
      btn_login: "Sign In",
      btn_register: "Create Account",
      or: "or",
      switch_register: "Don't have an account? Register",
      switch_login: "Already have an account? Sign in",
      verify_title: "Check your email",
      verify_msg: "We sent a confirmation link to your email. Please verify before logging in.",
      err_email: "Invalid email address.",
      err_disposable: "Temporary email addresses are not allowed. Please use Gmail, Outlook, iCloud, etc.",
      err_password: "Password must be at least 8 characters.",
      err_confirm: "Passwords do not match.",
      err_generic: "An error occurred. Please try again."
    },
    admin: {
      title: "Admin Panel",
      projects: "Projects",
      expeditions: "Expeditions",
      contacts: "Contact Submissions",
      users: "Users",
      new_project: "New Project",
      new_expedition: "New Expedition",
      publish: "Publish",
      unpublish: "Unpublish",
      edit: "Edit",
      delete: "Delete",
      confirm_delete: "Are you sure? This cannot be undone.",
      status_new: "New",
      status_read: "Read",
      status_replied: "Replied"
    }
  },

  ru: {
    nav: {
      mission: "Миссия",
      programs: "Программы",
      about: "О нас",
      gallery: "Галерея",
      expeditions: "Экспедиции",
      contact: "Связаться",
      login: "Войти",
      dashboard: "Личный кабинет",
      admin: "Панель администратора",
      logout: "Выйти"
    },
    hero: {
      tag: "Долина Рашт, Таджикистан · 3 000 м",
      title: "Защити <em>горы.</em><br>Восстанови будущее.",
      sub: "Мы работаем в Камаробском ущелье — одной из последних нетронутых горных экосистем Центральной Азии — чтобы сохранить чистую воду, защитить леса и поддержать местные сообщества.",
      btn_programs: "Наши программы",
      btn_involve: "Присоединиться"
    },
    stats: {
      trees: "Посажено деревьев",
      land: "Охраняемая территория",
      villages: "Партнёрских сёл",
      volunteers: "Активных волонтёров"
    },
    mission: {
      tag: "Зачем мы существуем",
      title: "<em>Камаробское ущелье</em> нуждается в защите.",
      p1: "Долина Рашт простирается в сердце Таджикистана — это ландшафт ледниковых ручьёв, древних можжевеловых лесов и кочевых троп, существующих тысячелетиями. Изменение климата и вырубка лесов уничтожают их за десятилетия.",
      p2: "Фонд «Камароб Нейчер» основан людьми, которые ходили по этим горам, пили из этих родников и отказались молча смотреть на происходящее.",
      quote: "«Когда поднимаешься на 3 км выше села Шулмак и видишь ущелье сверху — понимаешь: это не может исчезнуть.»",
      p1_forest: "Восстановление леса",
      d1_forest: "Посадка местных пород можжевельника и ореха на деградировавших склонах Камаробского водораздела.",
      p2_water: "Доступ к чистой воде",
      d2_water: "Защита горных родников и речных коридоров, снабжающих водой 48 сёл.",
      p3_wild: "Коридоры дикой природы",
      d3_wild: "Картирование и охрана миграционных маршрутов снежного барса, архара и беркута.",
      p4_comm: "Поддержка сообществ",
      d4_comm: "Обучение местных рейнджеров и создание устойчивых экотуристических маршрутов."
    },
    programs: {
      tag: "Активные программы",
      title: "Что мы <em>делаем</em>",
      p1_badge: "Вода",
      p1_title: "Сеть родников Шулмак",
      p1_desc: "Мы картируем, тестируем и защищаем 17 природных родников выше села Шулмак. Ежегодные отчёты о качестве воды публикуются для местных властей и международных партнёров.",
      p2_badge: "Леса",
      p2_title: "Восстановление высокогорья",
      p2_desc: "Каждую весну и осень волонтёры поднимаются на высоту 2 500–3 000 м для посадки саженцев. С 2021 года посажено более 12 000 деревьев.",
      p3_badge: "Экотуризм",
      p3_title: "Маршруты Камароба",
      p3_desc: "Мы разрабатываем сеть маркированных пешеходных троп через ущелье совместно с местными семьями — гостевые дома, гиды и экологический туризм."
    },
    about: {
      tag: "Наша история",
      title: "Рождено подъёмом <em>на 3 км</em>.",
      p1: "Летом 2023 года небольшая группа друзей из Душанбе поднялась на хребет над селом Шулмак в Раштском районе. Они пили воду из природного родника, ели дикие ягоды и наблюдали, как под ними кружит беркут.",
      p2: "Они также видели выжженные склоны, высохшее русло реки, о котором местные говорили «раньше текла всё лето», и пластиковый мусор в трёх часах от ближайшей дороги. Это противоречие стало основой организации.",
      p3: "Сегодня наша команда из 12 человек работает круглый год совместно с 320 волонтёрами из 8 стран для защиты 3 200 гектаров высокогорья.",
      quote: "«Мы пришли не из офисов НКО. Мы пришли из этих долин. В этом и есть разница.»",
      btn: "Присоединиться к команде →"
    },
    gallery: {
      tag: "С поля",
      title: "<em>Горы</em>, которые мы защищаем"
    },
    expeditions: {
      tag: "Полевые миссии",
      title: "Наши <em>экспедиции</em>",
      sub: "Каждый год мы организуем исследовательские и восстановительные экспедиции в высокогорье Камароба.",
      no_results: "Экспедиции пока не опубликованы.",
      location: "Место",
      elevation: "Высота",
      date: "Дата",
      read_more: "Подробнее →"
    },
    involve: {
      tag: "Действуй",
      title: "Стань частью <em>решения</em>",
      c1_title: "Волонтёрство",
      c1_desc: "Присоединяйтесь к сезонным экспедициям по посадке деревьев. Опыт не нужен — нужна лишь готовность идти, копать и заботиться.",
      c1_btn: "Подать заявку",
      c2_title: "Партнёрство и финансирование",
      c2_desc: "Мы партнёримся с организациями, правительствами и компаниями, разделяющими наши ценности. Прозрачная отчётность для всех крупных доноров.",
      c2_btn: "Стать партнёром"
    },
    contact: {
      tag: "Свяжитесь с нами",
      title: "Напишите <em>нам</em>.",
      sub: "Хотите стать волонтёром, партнёром или просто узнать больше о Камаробе — мы рады вашему сообщению.",
      address: "Душанбе, Республика Таджикистан",
      field_missions: "Полевые миссии: апрель – октябрь",
      security_title: "Защищённая форма",
      security_desc: "Защита от спама, XSS-инъекций и подмены данных. Никакие персональные данные на наших серверах не хранятся.",
      label_name: "Полное имя",
      label_email: "Электронная почта",
      label_subject: "Мне интересно",
      label_msg: "Сообщение",
      opt_vol: "Волонтёрство в экспедиции",
      opt_partner: "Институциональное партнёрство",
      opt_fund: "Финансирование / Грант",
      opt_media: "СМИ / Пресса",
      opt_other: "Другое",
      ph_name: "Ваше имя",
      ph_email: "вы@example.com",
      ph_msg: "Расскажите о себе и как вы хотели бы участвовать…",
      btn_send: "Отправить",
      btn_sending: "Отправка…",
      success: "✅ Спасибо! Мы свяжемся в течение 48 часов.",
      error: "❌ Ошибка отправки. Напишите на info@kamarobnature.org",
      err_name: "Пожалуйста, введите ваше имя.",
      err_email: "Пожалуйста, введите корректный email.",
      err_msg: "Сообщение слишком короткое.",
      err_rate: "Слишком много отправок. Подождите час и попробуйте снова."
    },
    footer: {
      desc: "Защищаем высокогорье долины Рашт в Таджикистане — для людей, которые там живут, и экосистем, которые поддерживают всех нас.",
      col1: "Программы",
      col2: "Организация",
      rights: "© 2026 Kamarob Nature Fund. Все права защищены.",
      dev: "Сайт разработан"
    },
    auth: {
      login_title: "С возвращением",
      login_sub: "Войдите в свой аккаунт Kamarob",
      register_title: "Присоединяйтесь",
      register_sub: "Создайте бесплатный аккаунт",
      label_name: "Полное имя",
      label_email: "Электронная почта",
      label_password: "Пароль",
      label_confirm: "Подтвердите пароль",
      btn_login: "Войти",
      btn_register: "Создать аккаунт",
      or: "или",
      switch_register: "Нет аккаунта? Зарегистрироваться",
      switch_login: "Уже есть аккаунт? Войти",
      verify_title: "Проверьте почту",
      verify_msg: "Мы отправили ссылку подтверждения на ваш email. Подтвердите перед входом.",
      err_email: "Некорректный email.",
      err_disposable: "Временные email-адреса не разрешены. Используйте Gmail, Outlook, iCloud и т.д.",
      err_password: "Пароль должен содержать не менее 8 символов.",
      err_confirm: "Пароли не совпадают.",
      err_generic: "Произошла ошибка. Попробуйте снова."
    },
    admin: {
      title: "Панель администратора",
      projects: "Проекты",
      expeditions: "Экспедиции",
      contacts: "Обращения",
      users: "Пользователи",
      new_project: "Новый проект",
      new_expedition: "Новая экспедиция",
      publish: "Опубликовать",
      unpublish: "Снять с публикации",
      edit: "Редактировать",
      delete: "Удалить",
      confirm_delete: "Вы уверены? Это действие нельзя отменить.",
      status_new: "Новое",
      status_read: "Прочитано",
      status_replied: "Отвечено"
    }
  },

  de: {
    nav: {
      mission: "Mission",
      programs: "Programme",
      about: "Über uns",
      gallery: "Galerie",
      expeditions: "Expeditionen",
      contact: "Kontakt",
      login: "Anmelden",
      dashboard: "Dashboard",
      admin: "Admin-Panel",
      logout: "Abmelden"
    },
    hero: {
      tag: "Rasht-Tal, Tadschikistan · 3.000 m",
      title: "Schütze das <em>Hochland.</em><br>Restore die Zukunft.",
      sub: "Wir arbeiten in der Kamarob-Schlucht — einem der letzten unberührten Bergökosysteme Zentralasiens — um sauberes Wasser zu bewahren, Wälder zu schützen und lokale Gemeinschaften zu stärken.",
      btn_programs: "Unsere Programme",
      btn_involve: "Mitmachen"
    },
    stats: {
      trees: "Gepflanzte Bäume",
      land: "Geschütztes Land",
      villages: "Partnerdörfer",
      volunteers: "Aktive Freiwillige"
    },
    mission: {
      tag: "Warum wir existieren",
      title: "Die <em>Kamarob-Schlucht</em> braucht eine Stimme.",
      p1: "Das Rasht-Tal erstreckt sich durch das Herz Tadschikistans — eine Landschaft aus Gletscherströmen, alten Wacholderwäldern und Nomadenpfaden, die seit Jahrtausenden existieren. Klimawandel und Abholzung vernichten sie innerhalb von Jahrzehnten.",
      p2: "Der Kamarob Nature Fund wurde von Menschen gegründet, die diese Berge bewandert, aus diesen Quellen getrunken und sich geweigert haben, schweigend zuzuschauen.",
      quote: "„Wenn man 3 km über dem Dorf Shukmak steht und die Schlucht von oben sieht, begreift man: Das darf nicht verschwinden."",
      p1_forest: "Waldwiederherstellung",
      d1_forest: "Wiederanpflanzung heimischer Wacholder- und Walnussarten auf degradierten Hängen.",
      p2_water: "Zugang zu sauberem Wasser",
      d2_water: "Schutz der Bergquellen und Flusskorridore, die 48 Dörfer mit Trinkwasser versorgen.",
      p3_wild: "Wildtierkorridore",
      d3_wild: "Kartierung von Migrationsrouten für Schneeleoparden, Marco-Polo-Schafe und Steinadler.",
      p4_comm: "Gemeinschaftsstärkung",
      d4_comm: "Ausbildung lokaler Ranger und Schaffung nachhaltiger Ökotourismusrouten."
    },
    programs: {
      tag: "Aktive Programme",
      title: "Was wir <em>tun</em>",
      p1_badge: "Wasser",
      p1_title: "Shukmak-Quellnetzwerk",
      p1_desc: "Wir kartieren, testen und schützen 17 natürliche Quellen oberhalb des Dorfes Shukmak. Jährliche Wasserqualitätsberichte werden mit lokalen Behörden und internationalen Partnern geteilt.",
      p2_badge: "Wälder",
      p2_title: "Hochland-Aufforstung",
      p2_desc: "Jedes Frühjahr und jeden Herbst steigen Freiwillige auf 2.500–3.000 m, um heimische Setzlinge zu pflanzen. Seit 2021 wurden über 12.000 Bäume gepflanzt.",
      p3_badge: "Ökotourismus",
      p3_title: "Kamarob-Wanderwege",
      p3_desc: "Wir entwickeln markierte Wanderwege durch die Schlucht — in Zusammenarbeit mit Familien vor Ort für Gästehäuser, Führer und umweltfreundliche Praktiken."
    },
    about: {
      tag: "Unsere Geschichte",
      title: "Geboren aus einem <em>3-km-Aufstieg</em>.",
      p1: "Im Sommer 2023 wanderte eine kleine Gruppe von Freunden aus Duschanbe zu einem Kamm oberhalb des Dorfes Shukmak im Rasht-Distrikt. Sie tranken Wasser aus einer natürlichen Quelle, aßen Wildbeeren und beobachteten, wie ein Steinadler unter ihnen kreiste.",
      p2: "Sie sahen auch verbrannte Hänge, ein ausgetrocknetes Flussbett, von dem Einheimische sagten, es „floss früher den ganzen Sommer", und Plastikmüll drei Stunden vom nächsten Weg entfernt.",
      p3: "Heute arbeitet unser Kernteam von 12 Personen ganzjährig mit 320 Freiwilligen aus 8 Ländern zum Schutz von 3.200 Hektar Hochlandterrain.",
      quote: "„Wir kommen nicht aus NGO-Büros. Wir kommen aus diesen Tälern. Das ist der Unterschied."",
      btn: "Team beitreten →"
    },
    gallery: {
      tag: "Aus dem Feld",
      title: "Die <em>Berge</em>, die wir schützen"
    },
    expeditions: {
      tag: "Feldmissionen",
      title: "Unsere <em>Expeditionen</em>",
      sub: "Jedes Jahr organisieren wir Forschungs- und Wiederherstellungsexpeditionen in das Kamarob-Hochland.",
      no_results: "Noch keine Expeditionen veröffentlicht.",
      location: "Ort",
      elevation: "Höhe",
      date: "Datum",
      read_more: "Mehr lesen →"
    },
    involve: {
      tag: "Aktiv werden",
      title: "Sei Teil der <em>Lösung</em>",
      c1_title: "Freiwillig mithelfen",
      c1_desc: "Nimm an unseren saisonalen Pflanzexpeditionen teil. Keine Erfahrung nötig — nur die Bereitschaft zu klettern, zu graben und sich zu kümmern.",
      c1_btn: "Freiwillig bewerben",
      c2_title: "Partner werden",
      c2_desc: "Wir arbeiten mit Organisationen, Regierungen und Unternehmen zusammen, die unsere Werte teilen. Transparente Finanzberichte für alle Hauptsponsoren.",
      c2_btn: "Partner werden"
    },
    contact: {
      tag: "Kontakt aufnehmen",
      title: "Lass uns <em>reden</em>.",
      sub: "Ob Sie freiwillig helfen, Partner werden oder einfach mehr über den Kamarob erfahren möchten — wir freuen uns auf Ihre Nachricht.",
      address: "Duschanbe, Republik Tadschikistan",
      field_missions: "Feldmissionen: April – Oktober",
      security_title: "Sicheres Formular",
      security_desc: "Geschützt gegen Spam, XSS-Injektionen und Datenmanipulation. Keine persönlichen Daten werden auf unseren Servern gespeichert.",
      label_name: "Vollständiger Name",
      label_email: "E-Mail-Adresse",
      label_subject: "Ich interessiere mich für",
      label_msg: "Nachricht",
      opt_vol: "Freiwilligenarbeit bei einer Feldmission",
      opt_partner: "Institutionelle Partnerschaft",
      opt_fund: "Finanzierung / Förderung",
      opt_media: "Medien / Presse",
      opt_other: "Sonstiges",
      ph_name: "Ihr Name",
      ph_email: "sie@beispiel.de",
      ph_msg: "Erzählen Sie uns von sich und wie Sie sich einbringen möchten…",
      btn_send: "Nachricht senden",
      btn_sending: "Wird gesendet…",
      success: "✅ Danke! Wir melden uns innerhalb von 48 Stunden.",
      error: "❌ Fehler beim Senden. Bitte schreiben Sie uns direkt.",
      err_name: "Bitte geben Sie Ihren Namen ein.",
      err_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      err_msg: "Nachricht ist zu kurz.",
      err_rate: "Zu viele Einsendungen. Bitte warten Sie eine Stunde."
    },
    footer: {
      desc: "Wir schützen das Hochland des Rasht-Tals in Tadschikistan — für die Menschen, die dort leben, und die Ökosysteme, die uns alle erhalten.",
      col1: "Programme",
      col2: "Organisation",
      rights: "© 2026 Kamarob Nature Fund. Alle Rechte vorbehalten.",
      dev: "Website erstellt von"
    },
    auth: {
      login_title: "Willkommen zurück",
      login_sub: "Melden Sie sich bei Ihrem Kamarob-Konto an",
      register_title: "Der Mission beitreten",
      register_sub: "Erstellen Sie ein kostenloses Konto",
      label_name: "Vollständiger Name",
      label_email: "E-Mail-Adresse",
      label_password: "Passwort",
      label_confirm: "Passwort bestätigen",
      btn_login: "Anmelden",
      btn_register: "Konto erstellen",
      or: "oder",
      switch_register: "Noch kein Konto? Registrieren",
      switch_login: "Bereits ein Konto? Anmelden",
      verify_title: "E-Mail überprüfen",
      verify_msg: "Wir haben einen Bestätigungslink an Ihre E-Mail gesendet.",
      err_email: "Ungültige E-Mail-Adresse.",
      err_disposable: "Temporäre E-Mail-Adressen sind nicht erlaubt.",
      err_password: "Passwort muss mindestens 8 Zeichen haben.",
      err_confirm: "Passwörter stimmen nicht überein.",
      err_generic: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
    },
    admin: {
      title: "Admin-Panel",
      projects: "Projekte",
      expeditions: "Expeditionen",
      contacts: "Kontaktanfragen",
      users: "Benutzer",
      new_project: "Neues Projekt",
      new_expedition: "Neue Expedition",
      publish: "Veröffentlichen",
      unpublish: "Zurückziehen",
      edit: "Bearbeiten",
      delete: "Löschen",
      confirm_delete: "Sind Sie sicher? Dies kann nicht rückgängig gemacht werden.",
      status_new: "Neu",
      status_read: "Gelesen",
      status_replied: "Beantwortet"
    }
  },

  tj: {
    nav: {
      mission: "Миссия",
      programs: "Барномаҳо",
      about: "Дар бораи мо",
      gallery: "Галерея",
      expeditions: "Экспедитсияҳо",
      contact: "Тамос",
      login: "Даромадан",
      dashboard: "Кабинети шахсӣ",
      admin: "Панели маъмур",
      logout: "Баромадан"
    },
    hero: {
      tag: "Водии Рашт, Тоҷикистон · 3 000 м",
      title: "Ҳимоя кунед <em>кӯҳсоронро.</em><br>Оиндаро барқарор кунед.",
      sub: "Мо дар Дараи Камароб — яке аз охирин экосистемаҳои нопок кӯҳии Осиёи Марказӣ — кор мекунем, то оби тозаро ҳифз кунем, ҷангалҳоро муҳофизат кунем ва ҷомеаҳои маҳаллиро дастгирӣ кунем.",
      btn_programs: "Барномаҳои мо",
      btn_involve: "Ҳамроҳ шавед"
    },
    stats: {
      trees: "Дарахтони шинонда",
      land: "Ҳудуди муҳофизатшаванда",
      villages: "Деҳаҳои шарик",
      volunteers: "Ихтиёркорони фаъол"
    },
    mission: {
      tag: "Чаро мо вуҷуд дорем",
      title: "<em>Дараи Камароб</em> ба садо ниёз дорад.",
      p1: "Водии Рашт дар қалби Тоҷикистон паҳн шудааст — манзараи дарёҳои яхбандӣ, ҷангалҳои қадимии арча ва роҳҳои кӯчмандии ҳазорсола. Тағйири иқлим ва буридани дарахтон онҳоро дар тӯли чанд даҳсола нест мекунад.",
      p2: "Фонди «Камароб Нейчер» аз ҷониби одамоне таъсис ёфт, ки дар ин кӯҳҳо гаштаанд, аз ин чашмаҳо нӯшидаанд ва аз нигоҳ кардани хомӯшона даст кашидаанд.",
      quote: "«Вақте ки аз болои деҳаи Шулмак 3 км боло мебарои ва дараро мебинӣ, мефаҳмӣ — ин наметавонад нопадид шавад.»",
      p1_forest: "Барқарорсозии ҷангал",
      d1_forest: "Шинондани намудҳои маҳаллии арча ва чормағз дар нишебиҳои вайронгашта.",
      p2_water: "Дастрасӣ ба оби тоза",
      d2_water: "Ҳифзи чашмаҳои кӯҳӣ ва дарёҳое, ки 48 деҳаро бо оби нӯшоборӣ таъмин мекунанд.",
      p3_wild: "Коридорҳои ҳайвоноти ваҳшӣ",
      d3_wild: "Харитасозӣ ва ҳифзи роҳҳои муҳоҷирати паланги барфӣ, кӯли Марко Поло ва уқоб.",
      p4_comm: "Қавӣ кардани ҷомеа",
      d4_comm: "Омӯзиши рейнджерҳои маҳаллӣ ва эҷоди роҳҳои экотуристии устувор."
    },
    programs: {
      tag: "Барномаҳои фаъол",
      title: "Мо чӣ <em>мекунем</em>",
      p1_badge: "Об",
      p1_title: "Шабакаи чашмаҳои Шулмак",
      p1_desc: "Мо 17 чашмаи табиии болои деҳаи Шулмакро харитасозӣ, санҷиш ва ҳифз мекунем. Гузоришҳои солонаи сифати об бо мақомоти маҳаллӣ ва шарикони байналмилалӣ мубодила мешавад.",
      p2_badge: "Ҷангалҳо",
      p2_title: "Барқарорсозии кӯҳсор",
      p2_desc: "Ҳар баҳор ва тирамоҳ ихтиёркорон ба баландии 2 500–3 000 м мебароянд, то ниҳолҳои маҳаллӣ бишинонанд. Аз соли 2021 зиёда аз 12 000 дарахт шинонда шудааст.",
      p3_badge: "Экотуризм",
      p3_title: "Лоиҳаи масири Камароб",
      p3_desc: "Мо шабакаи масирҳои пиёдагардии нишонгузоришудаи дара ва хидматҳои маҳаллиро таҳия мекунем."
    },
    about: {
      tag: "Таърихи мо",
      title: "Аз <em>боло шудани 3 км</em> таваллуд шудааст.",
      p1: "Тобистони соли 2023 як гурӯҳи хурди дӯстон аз Душанбе ба пушти кӯҳ болои деҳаи Шулмак дар ноҳияи Рашт боло шуданд. Онҳо аз чашмаи табиӣ нӯшиданд, мевачаҳои ваҳшӣ хӯрданд ва тамошо карданд, ки чӣ гуна уқоб дар зери пояшон давр мезанад.",
      p2: "Онҳо инчунин нишебиҳои сӯхта, дарёчаи хушк, ки аҳолии маҳаллӣ мегуфт \"пештар тамоми тобистон мегузашт\", ва партовҳои пластикиро дар масофаи се соат аз роҳи наздиктарин диданд.",
      p3: "Имрӯз тими асосии мо аз 12 нафар дар тӯли сол бо 320 ихтиёркор аз 8 кишвар барои ҳифзи 3 200 гектар замини кӯҳии баланд кор мекунад.",
      quote: "«Мо аз дафтарҳои СҒА наомадаем. Мо аз ин водиҳо омадаем. Ин фарқ аст.»",
      btn: "Ба гурӯҳ ҳамроҳ шавед →"
    },
    gallery: {
      tag: "Аз саҳро",
      title: "<em>Кӯҳҳое</em>, ки мо ҳифз мекунем"
    },
    expeditions: {
      tag: "Миссияҳои саҳроӣ",
      title: "Экспедитсияҳои <em>мо</em>",
      sub: "Ҳар сол мо экспедитсияҳои тадқиқотӣ ва барқарорсозӣ ба кӯҳсори Камароб ташкил мекунем.",
      no_results: "Ҳоло экспедитсияҳо нашр нашудаанд.",
      location: "Маҳал",
      elevation: "Баландӣ",
      date: "Сана",
      read_more: "Бештар бихонед →"
    },
    involve: {
      tag: "Амал кунед",
      title: "Як қисми <em>ҳалли масъала</em> шавед",
      c1_title: "Ихтиёркорӣ",
      c1_desc: "Ба экспедитсияҳои мавсимии шинондани дарахт ҳамроҳ шавед. Таҷриба лозим нест — танҳо омодагии боло рафтан, кофтан ва ғамхорӣ кардан.",
      c1_btn: "Дархост кунед",
      c2_title: "Шарикӣ ва маблағгузорӣ",
      c2_desc: "Мо бо ташкилотҳо, ҳукуматҳо ва ширкатҳое, ки арзишҳои моро мубодила мекунанд, шарикӣ мекунем.",
      c2_btn: "Шарик шавед"
    },
    contact: {
      tag: "Тамос гиред",
      title: "Гап <em>мезанем</em>.",
      sub: "Хоҳед ихтиёркор шавед, шарик шавед ё танҳо дар бораи Камароб бештар донед — мо хурсанд мешавем.",
      address: "Душанбе, Ҷумҳурии Тоҷикистон",
      field_missions: "Миссияҳои саҳроӣ: апрел – октябр",
      security_title: "Шакли бехатар",
      security_desc: "Аз спам, XSS ва иваз кардани маълумот муҳофизат шудааст.",
      label_name: "Номи пурра",
      label_email: "Почтаи электронӣ",
      label_subject: "Ба ман шавқовар аст",
      label_msg: "Паём",
      opt_vol: "Ихтиёркорӣ дар экспедитсия",
      opt_partner: "Шарикии ниҳодӣ",
      opt_fund: "Маблағгузорӣ / Грант",
      opt_media: "Расонаҳо / Матбуот",
      opt_other: "Дигар",
      ph_name: "Номи шумо",
      ph_email: "шумо@example.com",
      ph_msg: "Дар бораи худ ва чӣ гуна иштирок кардан бигӯед…",
      btn_send: "Фиристодан",
      btn_sending: "Фиристода мешавад…",
      success: "✅ Ташаккур! Мо дар тӯли 48 соат тамос мегирем.",
      error: "❌ Хатогӣ. Мустақиман ба info@kamarobnature.org нависед.",
      err_name: "Лутфан номи худро ворид кунед.",
      err_email: "Лутфан почтаи дурустро ворид кунед.",
      err_msg: "Паём хеле кӯтоҳ аст.",
      err_rate: "Дархостҳои зиёд. Як соат интизор шавед."
    },
    footer: {
      desc: "Мо кӯҳсори водии Раштро дар Тоҷикистон ҳифз мекунем — барои одамоне, ки дар он зиндагӣ мекунанд ва экосистемаҳое, ки ҳамаи моро нигоҳ медоранд.",
      col1: "Барномаҳо",
      col2: "Ташкилот",
      rights: "© 2026 Kamarob Nature Fund. Ҳамаи ҳуқуқҳо ҳифз шудаанд.",
      dev: "Сайт таҳия кардааст"
    },
    auth: {
      login_title: "Хуш омадед",
      login_sub: "Ба ҳисоби Kamarob ворид шавед",
      register_title: "Ба миссия ҳамроҳ шавед",
      register_sub: "Ҳисоби ройгон эҷод кунед",
      label_name: "Номи пурра",
      label_email: "Почтаи электронӣ",
      label_password: "Рамз",
      label_confirm: "Рамзро тасдиқ кунед",
      btn_login: "Даромадан",
      btn_register: "Ҳисоб эҷод кардан",
      or: "ё",
      switch_register: "Ҳисоб надоред? Бақайдгирӣ",
      switch_login: "Аллакай ҳисоб доред? Даромадан",
      verify_title: "Почтаро санҷед",
      verify_msg: "Мо ба почтаи шумо пайванди тасдиқ фиристодем.",
      err_email: "Почтаи нодуруст.",
      err_disposable: "Почтаҳои муваққатӣ иҷозат дода намешаванд.",
      err_password: "Рамз бояд камаш 8 аломат дошта бошад.",
      err_confirm: "Рамзҳо мувофиқат намекунанд.",
      err_generic: "Хатогӣ рух дод. Дубора кӯшиш кунед."
    },
    admin: {
      title: "Панели маъмур",
      projects: "Лоиҳаҳо",
      expeditions: "Экспедитсияҳо",
      contacts: "Мурољиатҳо",
      users: "Корбарон",
      new_project: "Лоиҳаи нав",
      new_expedition: "Экспедитсияи нав",
      publish: "Нашр кардан",
      unpublish: "Аз нашр бароварда",
      edit: "Таҳрир",
      delete: "Нест кардан",
      confirm_delete: "Шумо боварӣ доред? Ин амалро бекор кардан мумкин нест.",
      status_new: "Нав",
      status_read: "Хонда шуд",
      status_replied: "Ҷавоб дода шуд"
    }
  }
};

/* ── i18n Engine ──────────────────────────────── */
const i18n = (() => {
  const LANG_KEY = 'knf_lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'en';

  /**
   * Deep-get a translation key like 'hero.title'
   */
  function t(key) {
    const parts = key.split('.');
    let obj = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    for (const p of parts) {
      if (obj && obj[p] !== undefined) obj = obj[p];
      else {
        // Fallback to English
        obj = TRANSLATIONS.en;
        for (const pp of parts) { if (obj && obj[pp] !== undefined) obj = obj[pp]; else return key; }
        break;
      }
    }
    return typeof obj === 'string' ? obj : key;
  }

  /**
   * Apply all [data-i18n] attributes on the page
   */
  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerHTML = t(key); // innerHTML to support <em> tags
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
    // Update html lang attribute
    document.documentElement.lang =
      currentLang === 'tj' ? 'tg' : currentLang;
    // Update lang switcher active state
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    apply();
  }

  function getLang() { return currentLang; }

  // Auto-apply on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', apply);

  return { t, setLang, getLang, apply };
})();

window.i18n = i18n;
