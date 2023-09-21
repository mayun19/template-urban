import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  CustomerDetail,
  ListPaymentMethod,
  PrivateRoute,
  useAuthToken,
  useI18n,
  useShippingMethod,
  useBuyerNotes
} from '@sirclo/nexus'

/* library component */
import { useBrandCommon } from 'lib/useBrand'
import { useWhatsAppOTPSetting } from 'lib/client'
import useWindowSize from 'lib/useWindowSize'

/* copmonents */
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Layout from 'components/Layout/Layout'
import Stepper from 'components/Stepper'
import Icon from 'components/Icon/Icon'
import OrderSummaryBox, { classesOrderSummary } from 'components/OrderSummaryBox'
import LoaderPages from 'components/Loader/LoaderPages'
import Placeholder from 'components/Placeholder'
import Loader from 'components/Loader/Loader'

/* styles */
import styles from 'public/scss/pages/PaymentMethod.module.scss'
import stylesCustomerDetail from 'public/scss/components/CustomerDetail.module.scss'
import stylePopupOpt from 'public/scss/components/whatsappOTP/PopupOpt.module.scss'

const classesListPaymentMethod = {
  paymentItemEnabledClassName: styles.paymentItemEnabled,
  paymentItemDisabledClassName: styles.paymentItemDisabled,
  paymentTypeClassName: styles.paymentType,
  radioButtonContainerClassName: styles.radioButtonContainer,
  paymentImgClassName: styles.paymentImg,
  paymentWarningTextClassName: styles.paymentWarningText,
  paymentMethodDetailsClassName: styles.paymentMethodDetails,
  paymentMethodDetailBodyClassName: styles.paymentMethodDetailBody,
  selectedPaymentMethodClassName: styles.selectedPaymentMethod,
  paymentDetailsRowClassName: styles.paymentDetailsRow,
  paymentDetailsValueClassName: styles.paymentDetailsValue,
  paymentMethodDetailFooterClassName: styles.paymentMethodDetailFooter,
  promotionButtonGroupClassName: styles.promotionButtonGroup,
  couponButtonClassName: styles.couponButton,
  pointButtonClassName: styles.pointButton,
  agreementContainerClassName: styles.agreementContainer,
  agreementCheckboxClassName: styles.agreementCheckbox,
  buttonContainerClassName: styles.buttonContainer,
  radioButtonClassName: styles.radioButton,
  buttonClassName: styles.button,
  basePriceClassName: styles.basePrice,
  salePriceClassName: styles.salePrice,
  shippingPriceClassName: styles.shippingPrice,
  shippingDiscountClassName: styles.shippingDiscount,
  checkmarkClassName: styles.checkmark,
  paymentDetailsDeductionClassName: styles.paymentDetailsDeduction,
  // traveloka paylater
  travelokaPayLaterHeaderClassName: styles.travelokaPayLater_header,
  travelokaPayLaterFooterClassName: styles.travelokaPayLater_footer,
  travelokaPayLaterFooterTextClassName: styles.travelokaPayLater_footerText,
  travelokaPayLaterFooterImgClassName: styles.travelokaPayLater_footerImg,
  travelokaPayLaterFooterLinkClassName: styles.travelokaPayLater_footerLink
}

const classessOptWa = {
  optInContainer: stylePopupOpt.optInContainer,
  popupOverlay: stylePopupOpt.popupOverlay,
  optInTitle: stylePopupOpt.optInTitle,
  optInDescription: stylePopupOpt.optInDescription,
  optInInputContainer: stylePopupOpt.optInInputContainer,
  optInInputPrefixContainer: stylePopupOpt.optInInputPrefixContainer,
  optInInputPrefix: stylePopupOpt.optInInputPrefix,
  optInOptions: stylePopupOpt.optInOptions,
  optInOption: stylePopupOpt.optInOption,
  optInInputNumber: stylePopupOpt.optInInputNumber,
  optInCheckboxContainer: stylePopupOpt.optInCheckboxContainer,
  optInCheckbox: stylePopupOpt.optInCheckbox,
  optInBtn: stylePopupOpt.optInBtn,
}

const classesCustomerDetail = {
  customerDetailBoxClass: `container ${stylesCustomerDetail.customerDetaiBox}`,
  addressDetailClassName: stylesCustomerDetail.infoPersonaddressDetail,
  addressValueClassName: stylesCustomerDetail.infoPersonValueaddressValue,
  changePinClassName: "d-none",
}

const classesCustomerDetailPlaceholder = {
  placeholderList: styles.placeholderCustomerDetailList,
}

const placeholderClasses = {
  placeholderList: styles.placeholderList,
}


type PrivateComponentPropsType = {
  children: any
}

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  // @ts-ignore
  <PrivateRoute
    page="payment_method"
    loadingComponent={<LoaderPages />}
  >
    {children}
  </PrivateRoute>
)

const PaymentMethods: FC<any> = ({
  lng,
  lngDict,
  hasOtp,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const router: any = useRouter()
  const size = useWindowSize()
  const { data } = useShippingMethod()
  const { data: notes } = useBuyerNotes()

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("placeOrder.checkOrder")]

  const icons = {
    expand: <Icon.orderSummary.expand size={20} />,
    collapse: <Icon.orderSummary.collapse size={20} />,
    closeButtonIcon: <Icon.orderSummary.close />,
    voucherIcon: <Icon.orderSummary.voucher />,
    pointIcon: <Icon.orderSummary.points />,
    removeVoucherIcon: <Icon.orderSummary.voucherRemoved />,
    removePointIcon: <Icon.orderSummary.voucherRemoved />,
    voucherAppliedIcon: <Icon.orderSummary.voucherApplied />,
    pointAppliedIcon: <Icon.orderSummary.voucherRemoved />,
    copyIcon: <Icon.thankYou.copy />
  }

  const layoutProps = {
    lngDict,
    i18n,
    lng,
    brand,
    withFooter: false,
    withHeader: false,
    SEO: {
      title: `${i18n.t("payment.title")}`
    }
  }

  return (
    <PrivateRouteWrapper>
      <Layout {...layoutProps}>
        <Breadcrumb
          bgBlack
          title={i18n.t("placeOrder.checkOrder")}
          links={linksBreadcrumb}
          lng={lng}
        />
        <Stepper
          isMobile={size?.width < 767}
          i18n={i18n}
          page="payment_method"
        />
        <section className={stylesCustomerDetail.section}>
          <CustomerDetail
            classes={classesCustomerDetail}
            isBilling={false}
            shippingInfoHeader={
              <div className={stylesCustomerDetail.headerContainer}>
                <h3>{i18n.t("shipping.shipTo")}</h3>
                <Link
                  href={{
                    pathname: "/[lng]/place_order",
                    query: router.query
                  }}
                >
                  <a className={stylesCustomerDetail.change}>{i18n.t("shipping.change")}</a>
                </Link>
              </div>
            }
            loadingComponent={
              <div className={`container ${styles.placeholderCustomerDetailContainer}`}>
                <Placeholder
                  classes={classesCustomerDetailPlaceholder}
                  withList
                  listMany={3}
                />
              </div>
            }
          />
          <div className="container">
            <div className={`${stylesCustomerDetail.customerDetaiBoxShipping}`}>
              <div className={stylesCustomerDetail.headerContainer}>
                <h3>{i18n.t("shipping.deliveryCourier")}</h3>
                <Link
                  href={{
                    pathname: "/[lng]/shipping_method",
                    query: router.query
                  }}
                >
                  <a className={stylesCustomerDetail.change} >{i18n.t("shipping.change")}</a>
                </Link>
              </div>
              <div className={stylesCustomerDetail.customerDetailShipping}>
                <p className={styles.customer_infoPersonValueShipping}>
                  {data?.shippingMethod?.shippingProvider}&nbsp;{data?.shippingMethod?.shippingService}
                  {" - "}
                  <span>
                    {data?.shippingMethod?.shippingCost}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {notes?.buyerNotes?.buyerNotes &&
            <div className="container">
              <div className={`${stylesCustomerDetail.customerDetaiBoxShipping}`}>
                <div className={stylesCustomerDetail.headerContainer}>
                  <h3 className={stylesCustomerDetail.notesTitle}>{i18n.t("cart.noteToSeller")}</h3>
                  <Link
                    href={{
                      pathname: "/[lng]/cart",
                      query: router.query
                    }}
                  >
                    <a className={stylesCustomerDetail.change} >{i18n.t("shipping.change")}</a>
                  </Link>
                </div>
                <div className={stylesCustomerDetail.infoPersonValueaddressValue}>
                  {notes?.buyerNotes?.buyerNotes}
                </div>
              </div>
            </div>
          }
        </section>
        <section className={`container ${styles.section}`}>
          <div className={styles.paymentContainer}>
            <h2 className={styles.title}>{i18n.t("payment.choosePayment")}</h2>
            <ListPaymentMethod
              classes={{
                ...classesListPaymentMethod,
                ...classesOrderSummary,
                ...classessOptWa
              }}
              withNotificationOptInModal={hasOtp}
              onSuccessCopyCodeCoupon={() => toast.success(i18n.t('coupon.successCopyCode'))}
              onErrorMsg={(msg) => toast.error(msg)}
              onErrorMsgCoupon={(msg) => toast.error(msg)}
              couponLoadingComponent={
                <div className={styles.voucherLoading}>
                  <Loader color="text-dark" />
                  <p>{i18n.t("global.loading")}</p>
                </div>
              }
              loadingComponent={
                <Placeholder
                  classes={placeholderClasses}
                  withList
                  listMany={5}
                />
              }
              loaderElement={
                <Placeholder
                  classes={placeholderClasses}
                  withList
                  listMany={5}
                />
              }
              popupLoader={LoaderPages}
              emptyState={
                <div className={styles.lookbookPlaceholder_wrapper}>
                  <p>{i18n.t("payment.isEmpty")}</p>
                </div>
              }
              {...icons}
            />
          </div>
          <div className={styles.orderSummaryBoxContainer}>
            <OrderSummaryBox
              i18n={i18n}
              lng={lng}
              withCartDetails
              withOrderSummary={false}
              page="payment_method"
            />
          </div>
        </section>

      </Layout>
    </PrivateRouteWrapper>
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
    hasOtp
  ] = await Promise.all([
    useBrandCommon(req, params, token),
    useWhatsAppOTPSetting(req, token)
  ])

  return {
    props: {
      ...brand,
      hasOtp
    }
  }
}

export default PaymentMethods