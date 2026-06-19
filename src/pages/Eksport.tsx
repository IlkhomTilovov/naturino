import { InfoPage } from './InfoPage';
import heroImg from '@/assets/naturino-lifestyle.jpg';

export default function Eksport() {
  return (
    <InfoPage
      heroImage={heroImg}
      eyebrow={{ uz: 'Xalqaro bozor', ru: 'Международный рынок' }}
      title={{ uz: 'PETFOOD MARKET dunyo bo‘ylab', ru: 'PETFOOD MARKET по всему миру' }}
      lead={{
        uz: 'Mahsulotlarimiz MDH, Yaqin Sharq va Janubiy Osiyo bozorlariga eksport qilinadi. Distribyutorlar uchun qulay shartlar va to‘liq hujjatlar paketi.',
        ru: 'Наша продукция экспортируется в страны СНГ, Ближнего Востока и Южной Азии. Удобные условия и полный пакет документов для дистрибьюторов.',
      }}
      stats={[
        { value: '8', label: { uz: 'Eksport mamlakatlari', ru: 'Стран экспорта' } },
        { value: '40+', label: { uz: 'Distribyutorlar', ru: 'Дистрибьюторов' } },
        { value: 'FOB / CIF', label: { uz: 'Yetkazib berish', ru: 'Поставка' } },
        { value: 'USD / EUR', label: { uz: 'Hisob-kitob', ru: 'Расчёты' } },
      ]}
      blocks={[
        {
          title: { uz: 'Geografiya', ru: 'География' },
          body: {
            uz: 'Qozog‘iston, Qirg‘iziston, Tojikiston, Turkmaniston, Ozarbayjon, Gruziya, BAA, Afg‘oniston. Yangi yo‘nalishlar — muhokama uchun ochiq.',
            ru: 'Казахстан, Киргизия, Таджикистан, Туркменистан, Азербайджан, Грузия, ОАЭ, Афганистан. Новые направления — открыты для обсуждения.',
          },
        },
        {
          title: { uz: 'Hujjatlar va sertifikatlar', ru: 'Документы и сертификаты' },
          body: {
            uz: 'Veterinar sertifikat, kelib chiqish sertifikati (CT-1, EUR.1), halal, ISO 22000. Bojxona rasmiylashtiruvi — to‘liq bizning tomondan.',
            ru: 'Ветеринарный сертификат, сертификат происхождения (СТ-1, EUR.1), halal, ISO 22000. Таможенное оформление — полностью с нашей стороны.',
          },
        },
        {
          title: { uz: 'Distribyutor uchun shartlar', ru: 'Условия для дистрибьюторов' },
          body: {
            uz: 'Hududiy eksklyuziv, marketing byudjeti, tashrif buyuruvchi treningi, retail-tayyor POS materiallar va onlayn-katalog.',
            ru: 'Региональный эксклюзив, маркетинговый бюджет, обучение представителей, готовые POS-материалы и онлайн-каталог.',
          },
        },
      ]}
    />
  );
}
