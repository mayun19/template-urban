/* Library Packages */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import { toast } from 'react-toastify'
import {
  useAuthToken,
  useI18n,
  Contact,
  isEnquiryAllowed
} from '@sirclo/nexus'

/* Library Templates */
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Layout from 'components/Layout/Layout'

/* Styles */
import styles from 'public/scss/pages/Contact.module.scss'

const classesContact = {
  containerClassName: styles.container,
  mapClassName: styles.map,
  formContainerClassName: styles.formContainer,
  titleClassName: styles.title,
  inputContainerClassName: styles.inputContainer,
  inputClassName: styles.input,
  labelClassName: styles.label,
  buttonContainerClassName: styles.buttonContainer,
  buttonClassName: styles.button,
  widgetClassName: styles.widget,
  mapAddressDetail: styles.mapAddressDetail,
  disclaimerMessageContainerClassName: styles.disclaimer
}

const ContactPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const allowedEnquiry = isEnquiryAllowed()
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("contact.title") },
    withAllowed: allowedEnquiry
  }

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("contact.title")]

  const contactPlaceholder = {
    name: i18n.t("contact.placeholderName"),
    subject: i18n.t("contact.placeholderSubject"),
    phone: i18n.t("contact.placeholderPhone"),
    email: i18n.t("contact.placeholderEmail"),
    message:i18n.t("contact.placeholderMessage")
  }

  return (
    <Layout {...layoutProps}>
      <LazyLoadComponent>
        <Breadcrumb 
          title={i18n.t("contact.title")} 
          links={linksBreadcrumb} 
          lng={lng}
        />
      </LazyLoadComponent>

      <div className="container">
        <Contact
          isAddressDetail={true}
          classes={classesContact}
          placeholder={contactPlaceholder}
          onCompleted={() => toast.success(i18n.t("contact.submitSuccess"))}
          onError={() => toast.error(i18n.t("contact.submitError"))}
        />
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

export default ContactPage