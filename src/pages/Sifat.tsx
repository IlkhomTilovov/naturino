import { InfoPage } from './InfoPage';
import heroImg from '@/assets/naturino-vet.jpg';

export default function Sifat() {
  return (
    <InfoPage
      heroImage={heroImg}
      eyebrow={{ uz: 'Sifat kafolati', ru: 'Гарантия качества' }}
      title={{ uz: 'Har bir donada — ishonchli sifat', ru: 'В каждой грануле — надёжное качество' }}
      lead={{
        uz: 'Biz uchun sifat — bu marketing emas, balki jarayon. Xom-ashyodan tortib do‘kondagi javongacha har bir bosqich nazorat ostida.',
        ru: 'Качество для нас — не маркетинг, а процесс. От сырья до полки в магазине каждый этап под контролем.',
      }}
      stats={[
        { value: 'ISO 22000', label: { uz: 'Sertifikat', ru: 'Сертификат' } },
        { value: 'HACCP', label: { uz: 'Tizim', ru: 'Система' } },
        { value: '24/7', label: { uz: 'Lab. nazorat', ru: 'Лаб. контроль' } },
        { value: '0%', label: { uz: 'GMO va bo‘yoq', ru: 'ГМО и красителей' } },
      ]}
      blocks={[
        {
          title: { uz: 'Xom-ashyo nazorati', ru: 'Контроль сырья' },
          body: {
            uz: 'Yetkazib beruvchilar auditi, har bir partiyani qabul qilishda fizik-kimyoviy tahlil va mikrobiologik tekshiruv.',
            ru: 'Аудит поставщиков, физико-химический анализ и микробиологический контроль каждой партии при приёмке.',
          },
        },
        {
          title: { uz: 'Ishlab chiqarish standarti', ru: 'Производственный стандарт' },
          body: {
            uz: 'HACCP printsiplari, kritik nuqtalarda 100% nazorat, har bir smenadan namuna olib arxivda saqlanadi.',
            ru: 'Принципы HACCP, 100% контроль в критических точках, образцы каждой смены архивируются.',
          },
        },
        {
          title: { uz: 'Veterinar ekspertiza', ru: 'Ветеринарная экспертиза' },
          body: {
            uz: 'Retseptlar veterinar-nutrisiologlar tomonidan tasdiqlanadi. AAFCO va FEDIAF standartlariga muvofiq.',
            ru: 'Рецепты утверждаются ветеринарами-нутрициологами. Соответствие стандартам AAFCO и FEDIAF.',
          },
        },
      ]}
    />
  );
}
