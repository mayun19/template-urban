/* Library Packages */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  useAuthToken,
  useI18n,
  Blogs,
  BlogCategories,
  getBlogHeaderImage,
  isBlogAllowed
} from '@sirclo/nexus'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { RiQuestionFill } from 'react-icons/ri'

/* Library Template */
import useWindowSize from 'lib/useWindowSize'
import { useBrandCommon } from 'lib/useBrand'
import { GRAPHQL_URI } from 'components/Constants'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'

/* Styles */
import styles from 'public/scss/pages/Blog.module.scss'

const classesBlogs = {
  blogsContainerClassName: styles.blog,
  blogContainerClassName: styles.blog_item,
  categoryClassName: styles.blog_itemCategory,
  imageContainerClassName: styles.blog_itemImageContainer,
  imageClassName: styles.blog_itemImage,
  descriptionClassName: styles.blog_itemDescription,
  titleClassName: styles.blog_itemTitle,
  authorClassName: styles.blog_itemAuthor,
  descriptionInnerFooterClassName: styles.blog_itemFooter,
  dateClassName: styles.blog_itemDate,
  contentContainerClassName: styles.blog_itemContent,
  authorPicClassName: "d-none",
  buttonClassName: styles.blog_itemReadmore
}

const classesBlogCategories = {
  containerClassName: styles.category,
  categoryClassName: styles.category_item,
  linkClassName: styles.category_link,
}

const classesPagination = {
  pagingClassName: styles.pagination,
  activeClassName: styles.pagination_item__active,
  itemClassName: styles.pagination_item,
  linkClassName: styles.pagination_link
}

const Blog: FC<any> = ({
  lng,
  lngDict,
  headerImage,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("blog.title")]

  const size = useWindowSize()
  const BlogAllowed = isBlogAllowed()
  const layoutProps = {
    lngDict, 
    i18n, 
    lng,
    brand,
    SEO: { title: `${i18n.t("blog.title")}` },
    withAllowed: { BlogAllowed }
  }

  const [totalCategories, setTotalCategories] = useState(null)

  return (
    <Layout {...layoutProps}>
      <Breadcrumb 
        lng={lng}
        title={i18n.t("blog.title")} 
        links={linksBreadcrumb} 
      />

      <div className={styles.wrapper}>

        <div className="container">
          <div className="row">

            <div className="col-12 col-md-8">

              <div className={`row ${styles.header}`}>
                <div className={`col-12 ${styles.header_image}`}>
                  <img src={headerImage} alt={i18n.t("blog.title")} title={i18n.t("blog.title")} />
                </div>
              </div>

              <div className={styles.sort}></div>

              <Blogs
                classes={classesBlogs}
                withPagination
                paginationClasses={classesPagination}
                paginationNextLabel={<FiChevronRight />}
                paginationPrevLabel={<FiChevronLeft />}
                itemPerPage={5}
                withReadMoreButton={true}
                thumborSetting={{
                  width: size.width < 768 ? 375 : 512,
                  format: "webp",
                  quality: 85,
                }}
                LoadingComponent={
                  <Placeholder
                    withList
                    withImage
                    listMany={5}
                    classes={{
                      placeholderList: styles.placeholder
                    }}
                  />
                }
                emptyStateComponent={
                  <div className={styles.empty}>
                    <div className={styles.empty_icon}>
                      <RiQuestionFill />
                    </div>
                    <p className={styles.empty_label}>
                      {i18n.t("blog.isEmpty")}
                    </p>
                  </div>
                }
              />

            </div>

            <div className={`col-12 col-md-4 ${styles.sidebar}`}>
              {(totalCategories > 0 || totalCategories === null) &&
                <div className={styles.sidebar_item}>
                  <div className={styles.sidebar_title}>
                    {i18n.t("blog.categories")}
                  </div>
                  <div className={styles.sidebar_body}>
                    <BlogCategories
                      classes={classesBlogCategories}
                      getCategoriesCount={(categoriesCount) => setTotalCategories(categoriesCount)}
                    />
                  </div>
                </div>
              }
            </div>

          </div>

        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params
}) => {
  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value;
  
  const [
    { brand },
    headerImage
  ] = await Promise.all([
    useBrandCommon(req, params, token),
    getBlogHeaderImage(GRAPHQL_URI(req), token),
  ])

  return {
    props: {
      ...brand,
      headerImage
    }
  }
}

export default Blog