import { FC } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import {
  PaymentConfirmation,
  CheckPaymentOrder,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'
/* library component */
import useWindowSize from 'lib/useWindowSize'
import { useBrandCommon } from 'lib/useBrand'
/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Icon from 'components/Icon/Icon'
import BankAccount from 'components/BankAccount/BankAccount'
import Loader from 'components/Loader/Loader'
/* styles */
import styles from 'public/scss/pages/PaymentNotif.module.scss'
import stylesPopup from 'public/scss/components/CheckPaymentOrder.module.scss'
import stylesBanks from 'public/scss/components/BanksAccount.module.scss'

const classesPaymentNotif = {
  paymentConfirmationDivClassName: styles.paymentNotif_form,
  paymentInfoUploadClassName: styles.paymentNotif_info,
  inputContainerClassName: styles.paymentNotif_inputContainer,
  inputClassName: styles.paymentNotif_input,
  selectClassName: styles.paymentNotif_select,
}

const classesPaymentConfirmation = {
  buttonConfirmClassName: styles.paymentConfirmation_buttonConfirm,
  detailContainerClassName: styles.paymentConfirmation_detailContainer,
  detailContentClassName: styles.paymentConfirmation_detailContent,
  detailHeaderClassName: styles.paymentConfirmation_detailHeader,
  detailTitleClassName: styles.paymentConfirmation_detailTitle,
  detailStatusClassName: styles.paymentConfirmation_detailStatus,
  paymentStatusCancelledClassName: styles.paymentConfirmation_detailStatusCancelled,
  paymentStatusReturnedClassName: styles.paymentConfirmation_detailStatusReturned,
  detailTotalAmountClassName: styles.paymentConfirmation_detailTotalAmount,
  detailDropdownClassName: styles.paymentConfirmation_detailDropdown,
  detailItemClassName: styles.paymentConfirmation_detailItem,
  detailItemImgClassName: styles.paymentConfirmation_detailItemImg,
  detailItemLabelClassName: styles.paymentConfirmation_detailItemLabel,
  detailItemPriceClassName: styles.paymentConfirmation_detailItemPrice,
  detailPriceBreakdownClassName: styles.paymentConfirmation_detailPriceBreakdown,
  detailFieldClassName: styles.paymentConfirmation_detailField,
  detailTotalFieldClassName: styles.paymentConfirmation_detailTotalField,
  detailHeaderDropdownClassName: styles.paymentConfirmation_detailHeaderDropdown,
  detailBodyDropdownClassName: styles.paymentConfirmation_detailBodyDropdown,
  labelClassName: styles.paymentConfirmation_label,
  uploadedImageClassName: styles.paymentConfirmation_uploadedImage,
  uploadedNameImageClassName: styles.paymentConfirmation_uploadedName,
  uploadedRemoveImageClassName: styles.paymentConfirmation_uploadedRemove
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

const classesCheckPaymentOrder = {
  checkPaymentOrderHeaderClassName: `d-none`,
  checkPaymentOrderTitleClassName: stylesPopup.checkOrder_title,
  checkPaymentOrderDescriptionClassName: stylesPopup.checkOrder_description,
  checkPaymentOrderContentClassName: stylesPopup.checkOrder_content,
  checkPaymentOrderInputContentClassName: stylesPopup.checkOrder_inputContent,
  checkPaymentOrderInputTitleClassName: stylesPopup.checkOrder_inputTitle,
  checkPaymentOrderInputClassName: stylesPopup.checkOrder_input,
  checkPaymentOrderCloseButtonClassName: stylesPopup.checkOrder_closeButton,
  checkPaymentOrderSubmitButtonClassName: stylesPopup.checkOrder_submitButton
}


const PaymentConfirmationPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size = useWindowSize()
  const router = useRouter()

  let orderID = ""
  if (router.query.orderID) orderID = router.query.orderID.toString();

  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("paymentConfirm.heading")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: i18n.t("paymentConfirm.title") }
  }

  return (
    <Layout {...layoutProps}>
      <Breadcrumb
        title={i18n.t("paymentConfirm.heading")}
        links={linksBreadcrumb}
        lng={lng}
        titleMiddle={size.width > 767}
      />
      <section className="container">
        <div className={styles.paymentNotif_container}>
          <div className={styles.paymentNotif_inner}>
            {orderID ?
              <PaymentConfirmation
                orderIDProps={orderID}
                classes={{
                  ...classesPaymentNotif,
                  ...classesPaymentConfirmation,
                  ...classesBanks,
                }}
                orderDetailIcon={{
                  chevronUp: <Icon.chevronUp />,
                  chevronDown: <Icon.chevronDown />,
                }}
                removeIcon={<Icon.CartDetails.removeIcon size={20} />}
                onErrorMsg={(msg) => toast.error(msg)}
                onSuccessMsg={(msg) => toast.success(msg)}
                loadingComponent={
                  // @ts-ignore
                  <Loader color="text-light" />
                }
                withOrderDetails
                children={<BankAccount />}
                thumborSetting={{
                  width: 40,
                  format: "webp",
                  quality: 85
                }}
              />
              :
              <>
                <CheckPaymentOrder
                  classes={classesCheckPaymentOrder}
                  icon={{
                    loading: <Loader color="text-light" />,
                    close: <Icon.RiCloseFill />
                  }}
                  onErrorMsg={(msg) => toast.error(msg)}
                />
                <BankAccount />
              </>
            }
          </div>
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

export default PaymentConfirmationPage