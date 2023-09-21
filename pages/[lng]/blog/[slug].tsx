/* Library Packages */
import { FC, useState, useEffect} from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  BlogSingle,
  BlogCategories,
  useAuthToken,
  useI18n,
  BlogRecent
} from '@sirclo/nexus'
import { FiArrowLeft } from 'react-icons/fi'

/* Library Template */
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import SocialShare from 'components/SocialShare'

/* Styles */
import styles from 'public/scss/pages/Blog.module.scss'

const classesBlogSingle = {
  blogContainerClassName: styles.single,
  headerClassName: styles.single_header,
  headerContentClassName: styles.single_headerContent,
  createdByClassName: styles.single_meta,
  authorClassName: styles.single_author,
  dateClassName: styles.single_date,
  headerEndClassName: "d-none",
  authorPicContainerClassName: "d-none",
  authorPicClassName: "d-none",
  authorInfoClassName: "d-none",
  blogContentClassName: styles.single_content
}

const classesBlogCategories = {
  containerClassName: styles.category,
  categoryClassName: styles.category_item,
  linkClassName: styles.category_link,
}

const classesBlogRecent = {
  containerClassName: styles.recent,
  blogRecentClassName: styles.recent_item,
  imageClassName: styles.recent_image,
  labelContainerClassName: styles.recent_label,
  titleClassName: styles.recent_title,
  dateClassName: styles.recent_date
}

const classesSocialShare = {
  socialShareParentDivClassName: styles.sharer_items,
  socialShareItemClassName: styles.sharer_item,
  socialShareLabelClassName: styles.sharer_label
}

const BlogSlug: FC<any> = ({
  lng,
  lngDict,
  slug,
  brand,
  urlSite
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const [title, setTitle] = useState<string>("")
  const [totalCategories, setTotalCategories] = useState(null)
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("blog.title"), title]
  const layoutProps = {
    lngDict, 
    i18n, 
    lng, 
    brand,
    SEO: { title }
  }

  const router = useRouter()
  
  const handleBackButton = () => {
    router.push({
      pathname: '/[lng]/blog',
      query: {
        lng: lng
      }
    })
  }

  useEffect(() => {
    classesBlogSingle.authorClassName = `${classesBlogSingle.authorClassName} ${lng}`
  })

  return (

    <Layout {...layoutProps}>
      <Breadcrumb 
        lng={lng}
        title={title} 
        links={linksBreadcrumb} 
      />

      <div className={styles.wrapper}>

        <div className="container">
          <div className="row">

            <div className="col-12 col-md-8">

              <BlogSingle
                classes={classesBlogSingle}
                ID={Array.isArray(slug) ? slug[0].toString() : slug.toString()}
                getTitle={setTitle}
                loadingComponent={
                  <Placeholder
                    withList
                    listMany={5}
                    classes={{
                      placeholderList: styles.placeholder
                    }}
                  />
                }
                errorComponent={
                  <div className="alert alert-danger">
                    {i18n.t("global.error")}
                  </div>
                }
              />

              <div className={styles.sharer}>
                <SocialShare 
                  i18n={i18n} 
                  urlSite={urlSite}
                  classes={classesSocialShare}
                  customLabel={i18n.t("blog.share")}
                />
              </div>

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

              <div className={styles.sidebar_item}>

                <div className={styles.sidebar_title}>
                  {i18n.t("blog.recentPost")}
                </div>

                <div className={styles.sidebar_body}>
                  
                  <BlogRecent
                    classes={classesBlogRecent}
                    limit={5}
                    linkPrefix="blog"
                    thumborSetting={{
                      width: 100,
                      format: "webp",
                      quality: 85
                    }}
                    loadingComponent={
                      <Placeholder
                        withList
                        withImage
                        listMany={5}
                        classes={{
                          placeholderList: styles.placeholder
                        }}
                      />
                    }
                    errorComponent={
                      <div className="alert alert-danger">
                        {i18n.t("global.error")}
                      </div>
                    }
                  />
                  <button onClick={handleBackButton} className={styles.sidebar_back}>
                    <FiArrowLeft />
                    <span>
                      {i18n.t("blog.back")}
                    </span>
                  </button>
                </div>

              </div>

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
  
  const { slug } = params
  const [ brand ] = await Promise.all([
    useBrandCommon(req, params, token),
    useAuthToken({req, res, env: process.env})
  ])
  const urlSite = `https://${req.headers.host}/${params.lng}/blog/${slug}`

  return {
    props: {
      ...brand,
      slug,
      urlSite
    }
  }
}

export default BlogSlug