/* Library Packages */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  Article,
  ArticleCategories,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'

/* Library Template */
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'

/* Styles */
import styles from 'public/scss/pages/Article.module.scss'

const classesPlaceholderArticle = {
	placeholderImage: styles.article_placeholder,
}

const classesArticleCategories = {
	articleCategoriesContainerClass: styles.sidebar_item,
	categoryTitleClass: styles.sidebar_title,
	articleCategoriesUlClass: styles.category,
	articleCategoriesLiClass: styles.category_item,
}

const ArticleDetail: FC<any> = ({
	lng,
	lngDict,
	slug,
	brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

	const i18n: any = useI18n()
  const [title, setTitle] = useState<string>("")
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title }
  }
  const linksBreadcrumb = [i18n.t("header.home"), title]

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
            <div className="col-12 col-md-8 col-lg-8">

              <div className={styles.single}>
                <Article
                  containerClassName={styles.article}
                  slug={slug as string}
                  getTitle={setTitle}
                  loadingComponent={
                    <Placeholder 
                      classes={classesPlaceholderArticle}
                      withImage 
                    />
                  }
                  errorComponent={
                    <p>{i18n.t("global.error")}</p>
                  }
                />
              </div>

            </div>
            <div className={`col-12 col-md-4 offset-lg-1 col-lg-3 ${styles.sidebar}`}>
              <ArticleCategories
                classes={classesArticleCategories}
              />
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
  const { brand } = await useBrandCommon(req, params, token)

	const { slug } = params

	return {
		props: {
			...brand,
			slug,
		}
	}
}

export default ArticleDetail