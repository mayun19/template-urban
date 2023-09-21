/* Library Packages */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  GiftCard,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'

/* Library Template */
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'

/* Styles */
import styles from 'public/scss/pages/GiftCard.module.scss'

const classesGiftCard = {
  containerClassName: styles.form,
  inputContainerClassName: styles.form_inputContainer,
  labelClassName: styles.form_inputLabel,
  inputClassName: styles.form_input,
  buttonClassName: styles.form_button
}

const GiftCardPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("giftCard.title")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    layoutClassName: styles.login_layout,
    SEO: { title: i18n.t("giftCard.title") },
    titleHeader: i18n.t("giftCard.title")
  }

  return (
    <Layout {...layoutProps} >
      <Breadcrumb 
        lng={lng}
        title={i18n.t("giftCard.title")} 
        links={linksBreadcrumb}
        withTitle={false}
      />

      <div className={styles.wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3">
              <div className={styles.header}>
                <h1 className={styles.header_title}>
                  {i18n.t("giftCard.title")}
                </h1>
                <p className={styles.header_description}>
                  {i18n.t("giftCard.desc")}
                </p>
              </div>
              <GiftCard
                classes={classesGiftCard}
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

  return {
    props: {
      ...brand
    }
  }
}

export default GiftCardPage