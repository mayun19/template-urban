/* Library Packages */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  useAuthToken,
  useI18n,
  Testimonials,
  isTestimonialAllowed,
  isTestimonialFormAllowed,
  TestimonialForm
} from '@sirclo/nexus'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'

/* Library Template */
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import Icon from 'components/Icon/Icon'

/* Styles */
import styles from 'public/scss/pages/Testimonials.module.scss'

const classesTestimonials = {
  containerClassName: styles.testimonials_container,
  cardClassName: styles.testimonials_card,
  imgClassName: styles.testimonials_img,
  mainClassName: styles.testimonials_main,
  contentClassName: styles.testimonials_content,
  userClassName: styles.testimonials_user,
  dateClassName: styles.testimonials_date
}

const classesTestimonalsForm = {
  backdropClassName: styles.testimonialForm_backdrop,
  formContainerClassName: styles.testimonialForm_formContainer,
  formClassName: styles.testimonialForm_form,
  inputContainerClassName: styles.testimonialForm_inputContainer,
  inputLabelClassName: styles.testimonialForm_inputLabel,
  inputClassName: styles.testimonialForm_input,
  verificationContainerClassName: styles.testimonialForm_verificationContainer,
  submitBtnClassName: styles.testimonialForm_submitBtn,
  imgUploadContainerClassName: styles.testimonialForm_imgUploadContainer,
  uploadIconClassName: styles.testimonialForm_uploadIcon,
  imgUploadClassName: styles.testimonialForm_imgUpload,
  publishOptionClassName: styles.testimonialForm_publishOption,
  optionClassName: styles.testimonialForm_option,
  testimonialHeaderClassName: styles.testimonialForm_testimonialHeader,
}

const paginationClasses = {
  pagingClassName: styles.pagination,
  activeClassName: styles.pagination_active,
  itemClassName: styles.pagination_item,
}

const classesPlaceholderTestimonials = {
  placeholderList: `${styles.testimonials_placeholder}`,
  placeholderImage: `${styles.testimonials_placeholderImage}`
}

const TestimonialsPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const router = useRouter()
  const testimonialAllowed = isTestimonialAllowed()
  const testimonialFormAllowed = isTestimonialFormAllowed()

  const [totalItem, setTotalItems] = useState<number>(null)
  const [showAdd, setShowAdd] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("testimonial.title")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("testimonial.title") },
    withAllowed: testimonialAllowed
  }

  const toogleShowAdd = () => setShowAdd(!showAdd)
  const handleBackButton = () => router.push("/[lng]", `/${lng}`)

  return (
    <Layout {...layoutProps}>
      <Breadcrumb 
        lng={lng}
        title={i18n.t("testimonial.title")} 
        links={linksBreadcrumb} 
      />

      <div className={styles.wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-12">
                  
              {!(totalItem > 0 || totalItem === null) ?
                <>
                  <Testimonials
                    getPageInfo={(pageInfo: any) => setTotalItems(pageInfo.totalItems)}
                    withImage
                    classes={classesTestimonials}
                    callPagination
                    itemPerPage={5}
                    paginationClasses={paginationClasses}
                    nextLabel={<FiChevronRight />}
                    prevLabel={<FiChevronLeft />}
                    loadingComponent={
                      [1, 2, 3].map((_, i) => (
                        <div className={styles.testimonials_placeholderContainer}>
                          <Placeholder
                            key={i}
                            classes={classesPlaceholderTestimonials}
                            withImage={true}
                            withList
                            listMany={3}
                          />
                        </div>
                      ))
                    }
                  />
                </>
              :
                <div className={styles.empty__flexibleHeight}>
                  <div className={styles.empty_icon}>
                    <Icon.article.emptyIcon />
                  </div>
                  <p className={styles.empty_label}>
                    {i18n.t("testimonial.isEmpty")}
                  </p>
                  <button 
                    type="button"
                    className={styles.empty_button__cta}
                    onClick={toogleShowAdd}
                  >
                    {i18n.t("testimonial.add")}
                  </button>
                  <button
                    type="button"
                    className={styles.empty_button}
                    onClick={handleBackButton}
                  >
                    {i18n.t("lookbook.errorButton")}
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {(showAdd && testimonialFormAllowed) &&
        <div className={styles.popup}>
          <div className={styles.popup_content}>
            <div className={styles.popup_header}>
              <div className={styles.popup_title}>
                {i18n.t("testimonial.add")}
              </div>
              <button
                type="button"
                className={styles.popup_close}
                onClick={() => setShowAdd(false)}
              >
                <Icon.RiCloseFill />
              </button>
            </div>
            <div className={styles.popup_body}>
              <TestimonialForm
                classes={classesTestimonalsForm}
                uploadIcon={i18n.t("testimonial.inputImage")}
                onUploadImageCompleted={() => toast.success(i18n.t("testimonial.successUpload"))}
                onUploadImageError={(error: any) => toast.error(error)}
                onCreateTestimonialCompleted={() => {
                  setShowAdd(false)
                  toast.success(i18n.t('testimonial.createSuccess'))
                }}
                onCreateTestimonialError={() => {
                  toast.error(i18n.t('testimonial.createError'))
                }}
                withVerification={true}
                isVerified={isVerified}
                verificationComponent={
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA}
                    onChange={() => setIsVerified(true)}
                  />
                }
              />
            </div>
          </div>
        </div>
      }

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

export default TestimonialsPage