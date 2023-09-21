/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Link from 'next/link'
import {
  CustomerDetail,
  ShippingMethods,
  useAuthToken,
  useI18n,
  PrivateRoute
} from '@sirclo/nexus'
/* library component */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'
/* copmonents */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Icon from 'components/Icon/Icon'
import OrderSummaryBox from 'components/OrderSummaryBox'
import Stepper from 'components/Stepper'
import LoaderPages from 'components/Loader/LoaderPages'
import Placeholder from 'components/Placeholder'
/* styles */
import styles from 'public/scss/pages/ShippingMethod.module.scss'
import stylesMap from 'public/scss/components/Map.module.scss'
import stylesCustomerDetail from 'public/scss/components/CustomerDetail.module.scss'
import stylesMapV2 from "public/scss/pages/PlaceorderV2.module.scss";


const classesCustomerDetail = {
  customerDetailBoxClass: `container ${stylesCustomerDetail.customerDetaiBox}`,
  addressContainerClassName: stylesCustomerDetail.infoaddressContainer,
  addressValueClassName: stylesCustomerDetail.infoPersonValueaddressValue,
  changePinClassName: "d-none",
}

const classesShippingMethod = {
  containerClass: styles.container,
  shippingRadioDiv: styles.shippingRadioDiv,
  inputClass: styles.input,
  shippingNameDivClass: styles.shippingNameDiv,
  shippingNameClass: styles.shippingName,
  shippingPriceDivClass: styles.shippingPriceDiv,
  shippingPriceDivDiscountedClass: styles.shippingPriceDivDiscounted,
  shippingDiscountPercentageDivClass: styles.shippingDiscountPercentageDiv,
  shippingDiscountedPriceClass: styles.shippingDiscountedPrice,
  shippingPriceClass: styles.shippingPrice,
  pinPointLocationClassName: styles.pinPointLocation,
  warningPinPointClassName: styles.warningPinPoint,
  inputLabel: styles.inputLabel,
  submitButtonClassName: styles.submitButton,
  moreShippingClassName: styles.moreShipping,
}

const mapClasses = {
  mapNoteClassName: stylesMap.mapNote,
  mapSelectAreaClassName: stylesMap.mapSelectArea,
  mapAreaClassName: stylesMap.mapArea,
  mapPopupBackgroundClassName: stylesMap.mapPopupBackground,
  mapHeaderWrapperClassName: stylesMap.mapHeaderWrapper,
  mapHeaderTitleClassName: stylesMap.mapHeaderTitle,
  mapHeaderCloseButtonClassName: stylesMap.mapHeaderCloseButton,
  mapHeaderNoteClassName: stylesMap.mapHeaderNote,
  mapLabelAddressClassName: `${stylesMap.mapLabelAddress} ml-2 mr-2`,
  mapPinPointIconClassName: stylesMap.mapPinPointIcon,
  mapButtonFooterClassName: `${stylesMap.mapButtonFooter}`,
  // V2
  mapClassName: stylesMapV2.map,
  mapPopupClassName: stylesMapV2.mapPopup,
  mapSearchBarContainerClassName: stylesMapV2.mapSearchBarContainer,
  mapSearchBarClassName: stylesMapV2.mapSearchBar,
  mapSearchBarInputClassName: `${styles.formInput} ${stylesMapV2.mapSearchBarInput}`,
  mapSearchCloseButtonClassName: stylesMapV2.mapSearchCloseButton,
  mapFooterContainerClassName: `${stylesMapV2.mapFooterContainer} mt-2 pt-2`,
  mapCenterButtonContainerClassName: stylesMapV2.mapCenterButtonContainer,
  mapCenterButtonClassName: stylesMapV2.mapPopupCenterButton,
}

const placeholderClasses = {
  placeholderList: styles.placeholderList,
}

const classesCustomerDetailPlaceholder = {
  placeholderList: styles.placeholderCustomerDetailList,
}

type PrivateComponentPropsType = {
  children: any
}

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  // @ts-ignore
  <PrivateRoute
    page="shipping_method"
    loadingComponent={<LoaderPages />}
    redirectCart="products"
  >
    {children}
  </PrivateRoute>
)

const ShippingMethodPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()
  const router = useRouter()

  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("placeOrder.checkOrder")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    layoutClassName: styles.placeOrder_layout,
    withFooter: false,
    withHeader: false,
    SEO: { title: `${i18n.t("shipping.title")}` }
  }

  return (
    <PrivateRouteWrapper>
      <Layout {...layoutProps} >
        <Breadcrumb
          bgBlack
          title={i18n.t("placeOrder.checkOrder")}
          links={linksBreadcrumb}
          lng={lng}
        />
        <Stepper
          isMobile={size?.width < 767}
          i18n={i18n}
          page="shipping_method"
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
        </section>
        <section className={`container ${styles.section}`}>
          <div className={styles.shippingContainer}>
            <h2 className={styles.shippingTitle}>{i18n.t("shipping.chooseCourier")}</h2>
            <ShippingMethods
              classes={{
                ...classesShippingMethod,
                ...mapClasses
              }}
              onErrorMsg={(msg) => toast.error(msg)}
              mapCenterIcon={<Icon.mapCenterIcon />}
              mapButtonCloseIcon={<Icon.RiCloseFill />}
              mapBackIcon={<Icon.RiCloseFill />}
              loadingComponent={
                <Placeholder
                  classes={placeholderClasses}
                  withList
                  listMany={9}
                />
              }
            />
          </div>
          <div className={styles.orderSummaryBoxContainer}>
            <OrderSummaryBox
              i18n={i18n}
              lng={lng}
              withCartDetails
              page="shipping_method"
            />
          </div>
        </section>
      </Layout>
    </PrivateRouteWrapper>
  );
};

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

export default ShippingMethodPage