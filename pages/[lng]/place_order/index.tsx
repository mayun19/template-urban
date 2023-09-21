/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import {
  PlaceOrderFormv2,
  useAuthToken,
  useI18n,
  PrivateRoute,
} from '@sirclo/nexus'
/* library component */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'
/* copmonents */
import Layout from 'components/Layout/Layout'
import OrderSummaryBox from 'components/OrderSummaryBox'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Icon from 'components/Icon/Icon'
import Stepper from 'components/Stepper'
import LoaderPages from 'components/Loader/LoaderPages'
import Placeholder from 'components/Placeholder'
/* styles */
import styles from 'public/scss/pages/Placeorder.module.scss'
import stylesPasswordStrength from 'public/scss/components/PasswordStrength.module.scss'
import stylesMap from 'public/scss/components/Map.module.scss'
import stylesDatePicker from 'public/scss/components/DatePicker.module.scss'
import stylesV2 from "public/scss/pages/PlaceorderV2.module.scss";

const placeOrderClasses = {
  placeOrderClassName: styles.placeOrder,
  formClassName: styles.form,
  loginLabelClassName: styles.loginLabel,
  submitButtonClassName: styles.submitButton,
  billingAddressContainerClassName: styles.billingAddressContainer,
  billingAddressHeaderClassName: styles.billingAddressHeader,
  billingAddressFooterClassName: styles.billingAddressFooter,
  signupLabelClassName: styles.signupLabel,
  shippingCheckboxLabelClassName: styles.shippingCheckboxLabel,
  passwordViewButtonClassName: styles.passwordViewButton,
  datePickerInputClassName: stylesDatePicker.datePicker__input,
  datePickerCalendarClassName: stylesDatePicker.datePicker__calendar,
  // V2
  formGroupClassName: styles.formGroup,
  inputClassName: `${styles.input} w-100`,
  labelClassName: stylesV2.label,
  billingAddressLabelClassName: stylesV2.billingAddressLabel,
  shippingAreaPopupClassName: stylesV2.mapPopup,
  shippingAreaPopupBackgroundClassName: stylesV2.shippingAreaPopupBackground,
  shippingAreaTitleClassName: stylesV2.shippingAreaTitle,
  shippingAreaCloseButtonClassName: stylesV2.shippingAreaCloseButton,
  shippingAreaPopupHeaderClassName: stylesV2.shippingAreaPopupHeader,
  addressMapButtonMapContainerClassName: stylesV2.addressMapButtonMapContainer,
  addressMapButtonMapLabelClassName: stylesV2.addressMapButtonMapLabel,
  addressMapButtonMapButtonClassName: stylesV2.addressMapButtonMapButton,
  addressPopupButtonClassName: stylesV2.mapButtonFooter,
}

const passwordStrengthClasses = {
  passwordStrengthBarClassName: stylesPasswordStrength.passwordStrengthBar,
  passwordCriteriaListClassName: stylesPasswordStrength.passwordCriteriaList,
  passwordCriteriaClassName: stylesPasswordStrength.passwordCriteria,
}

const mapClasses = {
  mapNoteClassName: stylesMap.mapNote,
  mapHeaderWrapperClassName: stylesMap.mapHeaderWrapper,
  mapHeaderTitleClassName: stylesMap.mapHeaderTitle,
  mapHeaderCloseButtonClassName: stylesMap.mapHeaderCloseButton,
  mapHeaderNoteClassName: stylesMap.mapHeaderNote,
  // V2
  mapContainerClassName: stylesV2.mapContainer,
  mapAreaClassName: stylesV2.mapArea,
  mapAddressContainerClassName: stylesV2.mapAddressContainer,
  mapFullAddressClassName: stylesV2.mapFullAddress,
  mapCityClassName: stylesV2.mapCity, 
  mapPinPointIconClassName: stylesMap.mapPinPointIcon,
  mapPostCodeClassName: stylesV2.mapPostCode,
  mapPopupClassName: stylesV2.mapPopup,
  mapPopupBackgroundClassName: stylesV2.mapPopupBackground,
  mapClassName: stylesV2.map,
  mapSearchBarContainerClassName: stylesV2.mapSearchBarContainer,
  mapSearchBarClassName: stylesV2.mapSearchBar,
  mapSearchBarInputClassName: `${styles.formInput} ${stylesV2.mapSearchBarInput}`,
  mapFormAddressClassName: stylesV2.mapFormAddress,
  mapChangeAddressButtonClassName: stylesV2.mapChangeAddressButton,
  mapSearchCloseButtonClassName: stylesV2.mapSearchCloseButton,
  mapButtonInputManualContainerClassName: stylesV2.mapButtonInputManualContainer,
  mapButtonInputManualTitleClassName: stylesV2.mapButtonInputManualTitle,
  mapButtonInputManualButtonClassName: stylesV2.mapButtonInputManualButton,
  mapFooterContainerClassName: stylesV2.mapFooterContainer,
  mapDistrictLabelClassName: stylesV2.mapDistrictLabel,
  mapButtonFooterContainerClassName: stylesV2.mapButtonFooterContainer,
  mapLabelAddressClassName: stylesV2.mapLabelAddress,
  mapButtonFooterClassName: stylesV2.mapButtonFooter,
  mapSelectAreaClassName: stylesMap.mapSelectArea,
  mapSelectAreaSpanClassName: stylesMap.mapSelectAreaSpan,
  mapCenterButtonContainerClassName: stylesV2.mapCenterButtonContainer,
  mapCenterButtonClassName: stylesV2.mapPopupCenterButton,
}

const customStyles = {
  control: () => ({
    display: 'flex',
    height: '50px',
    padding: '10px auto auto 8px',
    border: "1px solid #CFD4D9",
    borderRadius: "2px"
  }),
  indicatorsContainer: () => ({
    cursor: 'pointer',
    marginTop: '12px'
  }),
  singleValue: () => ({
    paddingLeft: '7px',
    paddingTop: '12px',
    fontSize: '14px'
  }),
  input: () => ({
    paddingLeft: '7px',
    paddingTop: '12px',
    fontSize: '14px'
  }),
  placeholder: () => ({
    color: 'hsl(0,0%,50%)',
    marginTop: '7px',
    marginLeft: '6px',
    marginRight: '2px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  }),
  menu: () => ({
    position: 'absolute',
    minWidth: '100%',
    zIndex: '3',
    backgroundColor: '#fff',
    border: "1px solid #CFD4D9",
    marginTop: "4px",
    borderRadius: "2px"
  }),
  indicatorContainer: () => ({
    marginTop: '-5px'
  })
}

const placeholderClasses = {
  placeholderList: styles.placeholderList,
}

type PrivateComponentPropsType = {
  children: any;
}

const PrivateRouteWrapper = ({ children }: PrivateComponentPropsType) => (
  // @ts-ignore
  <PrivateRoute
    page="place_order"
    loadingComponent={<LoaderPages />}
    redirectCart="products"
  >
    {children}
  </PrivateRoute>
)

const PlaceOrderPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("placeOrder.checkOrder")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    withFooter: false,
    withHeader: false,
    SEO: { title: `${i18n.t("orderSummary.placeOrder")}` }
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
          isMobile={size.width < 767}
          i18n={i18n}
          page="place_order"
        />

        <section className={`container ${styles.section}`}>
          <PlaceOrderFormv2
            classes={{
              ...placeOrderClasses,
              ...passwordStrengthClasses,
              ...mapClasses,
            }}
            logistixStyles={customStyles} 
            onErrorMsg={(msg) => toast.error(msg)}
            passwordViewIcon={<Icon.setNewPassword.passwordViewIcon />}
            passwordHideIcon={<Icon.setNewPassword.passwordHideIcon />}
            passwordFulfilledCriteriaIcon={<Icon.setNewPassword.passwordCriteriaIcon color="#1DB954" size={16} />}
            passwordUnfulfilledCriteriaIcon={<Icon.setNewPassword.passwordCriteriaIcon color="#E5E7EF" size={16} />}
            datePickerCalendarIcon={<Icon.register.datePickerCalendarIcon />}
            signupLabelPosition="bottom"
            loadingComponent={
              <>
                <div className={styles.placeOrder}>
                  <Placeholder
                    classes={placeholderClasses}
                    withList
                    listMany={9}
                  />
                </div>
                <div className={styles.orderSummaryBoxContainer}>
                  <Placeholder
                    classes={placeholderClasses}
                    withList
                    listMany={4}
                  />
                </div>
              </>
            }
            mapCenterIcon={<Icon.mapCenterIcon />}
            mapButtonCloseIcon={<Icon.RiCloseFill />}
          />
          <div className={styles.orderSummaryBoxContainer}>
            <OrderSummaryBox
              i18n={i18n}
              lng={lng}
              withCartDetails
              page="place_order"
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
  const { brand } = await useBrandCommon(req, params, token)

  return {
    props: {
      ...brand
    }
  };
}

export default PlaceOrderPage;
