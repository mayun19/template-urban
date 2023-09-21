/* Library Packages */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  Lookbook,
  isLookbookAllowed,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'

/* Library Template */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import Icon from 'components/Icon/Icon'

/* Styles */
import styles from 'public/scss/pages/Lookbook.module.scss'

const classesLookbook = {
  containerClassName: styles.lookbook,
  rowClassName: styles.lookbook_row,
  lookbookContainerClassName: styles.lookbook_container,
  imageClassName: styles.lookbook_image,
  lookbookLabelContainerClassName: styles.lookbook_labelContainer,
  labelClassName: styles.lookbook_label,
  linkClassName: styles.lookbook_link
}

const classesPlaceholderLookbook = {
  placeholderList: styles.lookbook_placeholder
}

const LookbookCategory: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()
  const router = useRouter()
  const LookbookAllowed = isLookbookAllowed()

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("lookbook.title")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: `${i18n.t("lookbook.title")}` },
    withAllowed: LookbookAllowed
  }

  const handleBackButton = () => {
    router.push("/[lng]", `/${lng}`)
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb 
        lng={lng}
        title={i18n.t("lookbook.title")} 
        links={linksBreadcrumb} 
      />
      <div className={styles.wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-12">

              <Lookbook
                classes={classesLookbook}
                linkText={i18n.t("lookbook.seeCollection")}
                pathPrefix={`lookbook/categories`}
                loadingComponent={
                  <div className={styles.lookbook_placeholderWrapper}>
                    <Placeholder
                      classes={classesPlaceholderLookbook}
                      withList
                      listMany={5}
                    />
                  </div>
                }
                emptyStateComponent={
                  <div className={styles.empty}>
                    <div className={styles.empty_icon}>
                      <Icon.article.emptyIcon />
                    </div>
                    <div className={styles.empty_labelWrapper}>
                      <p>{i18n.t("lookbook.isEmpty")}</p>
                    </div>
                    <button
                      className={styles.empty_button}
                      onClick={handleBackButton}
                    >
                      {i18n.t("lookbook.errorButton")}
                    </button>
                  </div>
                }
                errorComponent={
                  <div className={styles.empty}>
                    <div className={styles.empty_icon}>
                      <Icon.article.emptyIcon />
                    </div>
                    <div className={styles.empty_labelWrapper}>
                      <h3>{i18n.t("lookbook.errorTitle")}</h3>
                      <p>{i18n.t("lookbook.errorDesc")}</p>
                    </div>
                    <button
                      className={styles.empty_button}
                      onClick={handleBackButton}
                    >
                      {i18n.t("lookbook.errorButton")}
                    </button>
                  </div>
                }
                thumborSetting={{
                  width: size.width < 768 ? 400 : 600,
                  format: "webp",
                  quality: 85,
                }}
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
  const { brand } = await useBrandCommon(req, params, token);

  return {
    props: {
      ...brand
    }
  }
}

export default LookbookCategory