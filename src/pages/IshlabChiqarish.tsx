import { InfoPage } from './InfoPage';
import heroImg from '@/assets/naturino-product.jpg';

export default function IshlabChiqarish() {
  return (
    <InfoPage
      heroImage={heroImg}
      eyebrow={{ uz: 'Ishlab chiqarish', ru: 'Производство' }}
      title={{ uz: 'Zamonaviy zavod — Yevropa standartida', ru: 'Современный завод — европейский стандарт' }}
      lead={{
        uz: 'O‘zbekistondagi to‘liq tsiklli zavodimiz Yevropa uskunalari, avtomatlashtirilgan jarayonlar va qattiq sifat nazorati asosida ishlaydi.',
        ru: 'Наш завод полного цикла в Узбекистане работает на европейском оборудовании, с автоматизированными процессами и строгим контролем качества.',
      }}
      stats={[
        { value: '12 000 m²', label: { uz: 'Maydon', ru: 'Площадь' } },
        { value: '20 000 t', label: { uz: 'Yillik quvvat', ru: 'Годовая мощность' } },
        { value: '120+', label: { uz: 'Xodimlar', ru: 'Сотрудников' } },
        { value: '4', label: { uz: 'Ishlab chiqarish liniyasi', ru: 'Производственных линии' } },
      ]}
      blocks={[
        {
          title: { uz: 'Quruq ozuqa liniyasi', ru: 'Линия сухих кормов' },
          body: {
            uz: 'Ekstruziya texnologiyasi, past haroratli quritish va vakuumli yog‘ purkash — donalarning maksimal yutilishi va xushbo‘yligi uchun.',
            ru: 'Технология экструзии, низкотемпературная сушка и вакуумное напыление жира — для максимальной усвояемости и аромата.',
          },
        },
        {
          title: { uz: 'Nam ozuqa va paté', ru: 'Влажные корма и паштеты' },
          body: {
            uz: 'Sterilizatsiya liniyasi, hermetik konservalar va pouch qadoqlash. Konservantsiz, tabiiy retsept.',
            ru: 'Линия стерилизации, герметичные консервы и pouch-упаковка. Без консервантов, натуральная рецептура.',
          },
        },
        {
          title: { uz: 'Avtomatlashtirilgan ombor', ru: 'Автоматизированный склад' },
          body: {
            uz: 'WMS tizimi, FIFO printsipi, harorat va namlik nazorati — tovarning so‘nggi muddatigacha sifati saqlanadi.',
            ru: 'Система WMS, принцип FIFO, контроль температуры и влажности — качество сохраняется до конца срока годности.',
          },
        },
      ]}
    />
  );
}
