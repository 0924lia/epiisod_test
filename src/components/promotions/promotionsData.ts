import freeWeeks from '../../assets/promotions/free-weeks.jpg';
import commute from '../../assets/promotions/commute.jpg';
import girlWithPhone from '../../assets/property/promo-banner.jpg';
import bedroom from '../../assets/promotions/bedroom.jpg';
import payInFull from '../../assets/promotions/pay-in-full.jpg';

export type Offer = {
  id: string;
  title: string;
  text: string;
  image: string;
  /** `direct-debit` offers carry the light bronze tag (Figma 786:11011). */
  tag: 'exclusive' | 'direct-debit';
};

/** The offers on the Promotions page (Figma 786:10997), in Figma order. */
export const OFFERS: Offer[] = [
  {
    id: 'free-weeks',
    title: 'Limited Time Free Weeks Offer',
    text: 'Receive 2 weeks free rent for a 52-week lease, 1 week free rent for a 48-week/44-week/24-week lease',
    image: freeWeeks,
    tag: 'exclusive',
  },
  {
    id: 'commute',
    title: 'Save Up to $40/week on Your Commute',
    text: 'At EPIISOD, we’re committed to making your student life easier and more accessible. Students who commute to their university by public transport can receive up to $40 per week in transport allowance — helping you reduce travel costs and focus on what matters most.',
    image: commute,
    tag: 'direct-debit',
  },
  {
    id: 'short-stay',
    title: 'Flexible Short Stay from 4 Weeks To Fit Your Needs',
    text: 'Short stay options from just 4 weeks are applicable to room types: Signature Studio and Aspect Studio, starting from $699/week!',
    image: girlWithPhone,
    tag: 'exclusive',
  },
  {
    id: 'refer-a-friend',
    title: 'Refer a Friend - Double the Joy, $600 in Rewards!',
    text: 'Refer a friend to EPIISOD and you’ll both receive a $300 rent credit once they move in. It’s our way of saying thanks for growing our community!',
    image: bedroom,
    tag: 'direct-debit',
  },
  {
    id: 'pay-in-full',
    title: 'Pay in Full, Save $500',
    text: 'Secure your room for a 48-week or 52-week lease and enjoy a $500 rebate when you pay your rent in full. It’s our way of helping you start the year feeling confident, prepared, and fully settled.',
    image: payInFull,
    tag: 'exclusive',
  },
];
