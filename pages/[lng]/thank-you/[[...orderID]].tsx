/* library package */
import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { toast } from 'react-toastify'
import {
  ThankYou,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library component */
import { useBrandCommon } from 'lib/useBrand'
/* component */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Icon from 'components/Icon/Icon'
import Placeholder from 'components/Placeholder'
/* styles */
import styles from 'public/scss/pages/ThankYou.module.scss'
import stylesBanks from 'public/scss/components/BanksAccount.module.scss'
import stylesOrder from 'public/scss/pages/PaymentNotif.module.scss'

const classesThankYouPage = {
  thankYouClassName: styles.thankyou_inner,
  hankYouOrderID: styles.thankyou_label,
  thankYouMessageClassName: styles.thankyou_message,
  thankYouOrderID: styles.thankyou_orderID,
  buttonClassName: styles.thankyou_button,
}

const classesPaymentConfirmation = {
  buttonConfirmClassName: stylesOrder.paymentConfirmation_buttonConfirm,
  detailContainerClassName: stylesOrder.paymentConfirmation_detailContainer,
  detailContentClassName: stylesOrder.paymentConfirmation_detailContent,
  detailHeaderClassName: stylesOrder.paymentConfirmation_detailHeader,
  detailTitleClassName: stylesOrder.paymentConfirmation_detailTitle,
  detailStatusClassName: stylesOrder.paymentConfirmation_detailStatus,
  paymentStatusCancelledClassName: stylesOrder.paymentConfirmation_detailStatusCancelled,
  paymentStatusReturnedClassName: styles.paymentConfirmation_detailStatusReturned,
  detailTotalAmountClassName: stylesOrder.paymentConfirmation_detailTotalAmount,
  detailDropdownClassName: stylesOrder.paymentConfirmation_detailDropdown,
  detailItemClassName: stylesOrder.paymentConfirmation_detailItem,
  detailItemImgClassName: stylesOrder.paymentConfirmation_detailItemImg,
  detailItemLabelClassName: stylesOrder.paymentConfirmation_detailItemLabel,
  detailItemPriceClassName: stylesOrder.paymentConfirmation_detailItemPrice,
  detailPriceBreakdownClassName: stylesOrder.paymentConfirmation_detailPriceBreakdown,
  detailFieldClassName: stylesOrder.paymentConfirmation_detailField,
  detailTotalFieldClassName: stylesOrder.paymentConfirmation_detailTotalField,
  detailHeaderDropdownClassName: stylesOrder.paymentConfirmation_detailHeaderDropdown,
  detailBodyDropdownClassName: stylesOrder.paymentConfirmation_detailBodyDropdown,
  labelClassName: stylesOrder.paymentConfirmation_label,
}

const classesBanks = {
  bankAccountInformationClassName: stylesBanks.bank_information,
  bankAccountContainerClassName: stylesBanks.bank_container,
  bankAccountHeaderClassName: stylesBanks.bank_header,
  bankAccountSectionClassName: stylesBanks.bank_section,
  bankAccountLogoClassName: stylesBanks.bank_logoBank,
  bankAccountBodyClassName: stylesBanks.bank_body,
  bankAccountInfoAccountClassName: stylesBanks.bank_infoAccount,
  bankAccountNumberSectionClassname: stylesBanks.bank_numberSection,
  bankAccountCopyButtonClassName: stylesBanks.bank_buttonIcon,
  bankAccountIconCollapseClassName: stylesBanks.bank_buttonIcon,
  bankAccountLabelAccountNameClassName: stylesBanks.bank_name,
  bankAccountLabelAccountNumberClassName: stylesBanks.bank_bankAccountLabelAccountNumber
}

const ThankYouPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("placeOrder.checkOrder")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("thankYou.thanks") },
    withHeader: false,
    withFooter: false
  }

  return (
    <Layout {...layoutProps}>
      <div className={styles.thankyou_breadcumbSection}>
        <Breadcrumb
          bgBlack
          title={i18n.t("thankYou.thanks")}
          links={linksBreadcrumb}
          lng={lng}
        />
      </div>
      <section className="container">
        <div className={styles.thankyou_container}>
          <ThankYou
            thankYouImageURL={<div className={styles.thankyou_inner__icon} />}
            classes={{
              ...classesThankYouPage,
              ...classesPaymentConfirmation,
              ...classesBanks
            }}
            withDelay
            withOrderDetails
            loadingComponent={
              <Placeholder
                classes={{
                  placeholderList: styles.placeholderList,
                }}
                withList
                listMany={5}
              />
            }
            onSuccessMsg={(msg) => toast.success(msg)}
            icon={{
              chevronUp: <Icon.chevronUp />,
              chevronDown: <Icon.chevronDown />,
              copy: <Icon.thankYou.copy size="1em" />
            }}
          />
        </div>
      </section>
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

export default ThankYouPage