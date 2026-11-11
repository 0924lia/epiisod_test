import arrowRight from '../../../assets/blog/arrow-right-sand.svg';
import { categoryTone, postMeta } from '../../../components/blog/blogData';
import type { BlogPost } from '../../../components/blog/blogData';
import '../../../components/blog/BlogCard.css';

/** A post's v2 page. */
export const postHref = (p: BlogPost) => `/v2/blog/${p.audience}/${p.slug}`;

/**
 * v2: v1's blog card, linking to the post's v2 page.
 *
 * Blog card (Figma 1119:42884): the photo under a chocolate fade, with the category,
 * title, date and "Read now" at its foot. The whole card links to the post.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a href={postHref(post)} className="blog-card">
      <img
        className="blog-card__image"
        src={post.image}
        style={{ objectPosition: post.imagePosition }}
        alt=""
      />
      <span className="blog-card__shade" aria-hidden />
      <span className="blog-card__body">
        <span className="blog-card__heading">
          <span className={`blog-tag blog-tag--${categoryTone(post.category)} blog-card__category`}>
            {post.category}
          </span>
          <span className="blog-card__title">{post.title}</span>
        </span>
        <span className="blog-card__foot">
          <span className="blog-card__meta">{postMeta(post)}</span>
          <span className="blog-card__read">
            Read now
            <img src={arrowRight} width={24} height={24} alt="" />
          </span>
        </span>
      </span>
    </a>
  );
}
