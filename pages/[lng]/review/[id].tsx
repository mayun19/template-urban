/* Library Packages */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import {
  OrderReview,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
import { toast } from 'react-toastify'
import { 
  FiChevronDown, 
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { RiStarLine, RiStarFill } from 'react-icons/ri'

/* Library Template */
import useWindowSize from 'lib/useWindowSize'
import { useBrandCommon } from 'lib/useBrand'

/* Components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'

/* Styles */
import styles from 'public/scss/pages/Review.module.scss'

const classesOrderReview = {
  titleContainerClassName: styles.orderReview_titleContainer,
  titleClassName: styles.orderReview_title,
  subTitleClassName: styles.orderReview_subTitle,
  orderInfoContainerClassName: styles.orderReview_orderInfoContainer,
  orderInfoLineClassName: styles.orderReview_orderInfoLine,
  buyerInfoContainerClassName: styles.orderReview_buyerInfoContainer,
  buyerNameContainerClassName: styles.orderReview_buyerNameContainer,
  buyerNameLabelClassName: styles.orderReview_buyerNameLabel,
  buyerNameClassname: styles.orderReview_buyerName,
  buyerHideNameContainerClassName: styles.orderReview_buyerHideNameContainer,
  buyerHideNameLabelClassName: styles.orderReview_buyerHideNameLabel,
  buyerHideNameSwitchClassName: styles.orderReview_buyerHideNameSwitch,
  reviewTabContainerClassName: styles.orderReview_reviewTabContainer,
  activeTabClassName: styles.orderReview_activeTab,
  needsReviewTabContainerClassName: styles.orderReview_needsReviewTabContainer,
  needsReviewTabLabelClassName: styles.orderReview_needsReviewTabLabel,
  reviewedTabContainerClassName: styles.orderReview_reviewedTabContainer,
  reviewedTabLabelClassName: styles.orderReview_reviewedTabLabel,
  productInfoContainerClassName: styles.orderReview_productInfoContainer,
  productImageClassName: styles.orderReview_productImage,
  productDetailContainerClassName: styles.orderReview_productDetailContainer,
  productNameClassName: styles.orderReview_productName,
  yourRatingTextClassName: styles.orderReview_yourRatingText,
  productReviewButtonContainerClassName: styles.orderReview_productReviewButtonContainer,
  writeReviewButtonClassName: styles.orderReview_writeReviewButton,
  openReviewButtonClassName: styles.orderReview_openReviewButton,
  formContainerClassName: styles.orderReview_formContainer,
  formGroupClassName: styles.orderReview_formGroup,
  formLabelClassName: styles.orderReview_formLabel,
  starClassName: styles.orderReview_star,
  starContainerClassName: styles.orderReview_starContainer,
  containerClassName: styles.orderReview_container,
  imagesContainerClassName: styles.orderReview_imagesContainer,
  mediaContainerClassName: styles.orderReview_mediaContainer,
  imgClassName: styles.orderReview_img,
  imgUploadContainerClassName: styles.orderReview_imgUploadContainer,
  uploadIconClassName: styles.orderReview_uploadIcon,
  imgUploadClassName: styles.orderReview_imgUpload,
  mediaRemoverClassName: styles.orderReview_mediaRemover,
  reviewCardContainerClassName: styles.orderReview_reviewCardContainer,
  tileRatingClassName: styles.orderReview_tileRating,
  ratingContentClassName: styles.orderReview_ratingContent,
  ratingDescriptionClassName: styles.orderReview_ratingDescription,
  titleDescriptionClassName: styles.orderReview_titleDescription,
  descriptionContentClassName: styles.orderReview_descriptionContent,
  titleImageClassName: styles.orderReview_titleImage,
  imageContentClassName: styles.orderReview_imageContent,
  imageListClassName: styles.orderReview_imageList,
  pagingClassName: styles.orderReview_paging,
  activeClassName: styles.orderReview_active,
  itemClassName: styles.orderReview_item,
  linkClassName: styles.orderReview_link,
  reviewPopupContentClassName: styles.orderReview_reviewPopupContent,
  reviewPopupContainerClassName: styles.orderReview_reviewPopupContainer,
  reviewPopupImagePopupClassName: styles.orderReview_reviewPopupImagePopup,
  reviewPopupLeftButtonClassName: styles.orderReview_reviewPopupLeftButton,
  reviewPopupRightButtonClassName: styles.orderReview_reviewPopupRightButton,
  reviewPopupButtonCloseClassName: styles.orderReview_reviewPopupButtonClose,
  reviewPopupPreviewClassName: styles.orderReview_reviewPopupPreview,
  reviewPopupImagePreviewClassName: styles.orderReview_reviewPopupImagePreview,
  popupConfirmationSubmitContainerClassName: styles.orderReview_popupConfirmationSubmitContainer,
  popupConfirmationSubmitContentClassName: styles.orderReview_popupConfirmationSubmitContent,
  popupConfirmationSubmitTitleClassName: styles.orderReview_popupConfirmationSubmitTitle,
  popupConfirmationSubmitDescriptionClassName: styles.orderReview_popupConfirmationSubmitDescription,
  popupConfirmationSubmitWrapButtonClassName: styles.orderReview_popupConfirmationSubmitWrapButton,
  popupConfirmationSubmitButtonConfirmClassName: styles.orderReview_popupConfirmationSubmitButtonConfirm,
  popupConfirmationSubmitButtonNoClassName: styles.orderReview_popupConfirmationSubmitButtonNo,

  itemPerPageClassName: `${styles.itemPerPage} ml-auto`,
  itemPerPageOptionsClassName: styles.itemPerPageOptions,
  itemPerPageOptionClassName: styles.itemPerPageOption,
  itemPerPageActiveClassName: styles.itemPerPageActive
}

const paginationClasses = {
  pagingClassName: styles.pagination,
  activeClassName: styles.pagination_item__active,
  itemClassName: styles.pagination_item,
  linkClassName: styles.pagination_link
}

const ReviewPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const router = useRouter()
  const size = useWindowSize()
  const { id } = router.query

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("orderReview.title")]
  const layoutProps = {
    i18n,
    lng,
    lngDict,
    brand,
    SEO: {
      title: i18n.t("orderReview.title")
    }
  }

  const newClassesOrderReview = {
    ...classesOrderReview,
    ...paginationClasses
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb 
        lng={lng}
        title={i18n.t("orderReview.title")} 
        links={linksBreadcrumb}
        withTitle={true}
      />

      <div className={styles.wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 offset-md-3">
              <OrderReview
                classes={newClassesOrderReview}
                orderID={id as string}
                itemPerPageOptions={[5, 10, 15]}
                onSuccessMsg={(msg: string) => toast.success(msg)}
                onErrorMsg={(msg: string) => toast.error(msg)}
                arrowIconDown={<FiChevronDown />}
                arrowIconUp={<FiChevronUp />}
                reviewsNextLabel={<FiChevronRight />}
                reviewsPrevLabel={<FiChevronLeft />}
                unfilledRatingIcon={
                  <span className="unfilled">
                    <RiStarLine />
                  </span>
                }
                filledRatingIcon={
                  <span className="filled">
                    <RiStarFill />
                  </span>
                }
                thumborSetting={{
                  width: size.width < 768 ? 375 : 500,
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
  const { brand } = await useBrandCommon(req, params, token)

  return {
    props: {
      ...brand
    }
  }
}

export default ReviewPage