import { InfoPage } from './InfoPage';
import heroImg from '@/assets/naturino-ingredients.jpg';

export default function PrivateLabel() {
  return (
    <InfoPage
      heroImage={heroImg}
      eyebrow={{ uz: 'B2B yo‘nalish', ru: 'B2B направление' }}
      title={{
        uz: 'Private Label — sizning brendingiz, bizning ishlab chiqarish quvvatimiz',
        ru: 'Private Label — ваш бренд, наши производственные мощности',
      }}
      lead={{
        uz: 'PETFOOD MARKET hamkorlari uchun Private Label xizmatini taklif etadi: o‘z brendingiz ostida premium it va mushuk ozuqalarini ishlab chiqarish, retsept tanlash, qadoqlash dizayni va logistika — bitta nuqtada.',
        ru: 'PETFOOD MARKET предлагает партнёрам услугу Private Label: производство премиальных кормов для собак и кошек под вашим брендом, подбор рецептуры, дизайн упаковки и логистика — в одной точке.',
      }}
      stats={[
        { value: '50+', label: { uz: 'Tayyor retseptlar', ru: 'Готовых рецептур' } },
        { value: '7', label: { uz: 'Qadoq formati', ru: 'Форматов упаковки' } },
        { value: '14', label: { uz: 'Kunda namuna', ru: 'Дней до образца' } },
        { value: '100%', label: { uz: 'NDA va eksklyuziv', ru: 'NDA и эксклюзив' } },
      ]}
      blocks={[
        {
          title: { uz: 'Retsept va formula', ru: 'Рецепт и формула' },
          body: {
            uz: 'Tayyor formulalardan birini tanlang yoki o‘z brending DNA siga mos retsept ishlab chiqamiz — quruq, nam, treats va veterinar liniyalari uchun.',
            ru: 'Выберите готовую формулу или мы разработаем рецепт под ДНК вашего бренда — для сухих, влажных, лакомств и ветеринарных линеек.',
          },
        },
        {
          title: { uz: 'Qadoq va dizayn', ru: 'Упаковка и дизайн' },
          body: {
            uz: '400 g dan 15 kg gacha qoplar, doy-pack, konservalar. Brend-buk asosida dizayn, premium materiallar va eksport-tayyor markirovka.',
            ru: 'Пакеты от 400 г до 15 кг, doy-pack, консервы. Дизайн по бренд-буку, премиальные материалы и экспортная маркировка.',
          },
        },
        {
          title: { uz: 'Sifat va sertifikatsiya', ru: 'Качество и сертификация' },
          body: {
            uz: 'Har bir partiya laboratoriya nazoratidan o‘tadi. ISO 22000, HACCP, halal sertifikatlari mavjud — O‘zbekiston va eksport bozorlari uchun tayyor.',
            ru: 'Каждая партия проходит лабораторный контроль. Сертификаты ISO 22000, HACCP, halal — готовы к рынку Узбекистана и экспорту.',
          },
        },
      ]}
    />
  );
}
