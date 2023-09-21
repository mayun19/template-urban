/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import { toast } from 'react-toastify'
import {
  CartDetails,
  useAuthToken,
  useI18n,
  useCart
} from '@sirclo/nexus'

/* library template */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'

/* components */
import Icon from 'components/Icon/Icon'
import Layout from 'components/Layout/Layout'
import ProductRecomendation from 'components/ProductRecomendation'
import OrderSummaryBox from 'components/OrderSummaryBox'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'

/* styles */
import styles from 'public/scss/pages/Cart.module.scss'

const classesCartDetails = {
  className: styles.cart,
  itemClassName: styles.item,
  itemImageClassName: styles.itemImage,
  itemTitleClassName: styles.itemTitle,
  itemPriceClassName: styles.itemPrice,
  itemRegularPriceClassName: styles.itemRegularPrice,
  itemSalePriceWrapperClassName: styles.itemSalePriceWrapper,
  itemDiscountNoteClassName: styles.itemDiscountNote,
  itemQtyClassName: styles.itemQty,
  qtyBoxClassName: styles.qtyBox,
  itemNoteClassName: styles.itemNote,
  itemAmountClassName: styles.itemAmount,
  itemRemoveClassName: styles.itemRemove,
  cartFooterClassName: styles.cartFooter,
  cartFooterTextareaClassName: styles.cartFooterTextarea,
  itemEditClassName: styles.itemEdit,
  changeQtyButtonClassName: styles.changeQtyButton,
  removeButtonClassName: styles.removeButton,
  // hidden
  cartFooterTitleClassName: "d-none",
  headerQtyClassName: "d-none",
  cartHeaderClassName: "d-none",
}

const classesCartPlaceholder = {
  placeholderList: styles.placeholderList,
  placeholderImage: styles.placeholderImage,
}
const Cart: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size: any = useWindowSize()
  const { data: dataCart } = useCart()

  const [SKUs, setSKUs] = useState<Array<string>>(null)
  const [invalidMsg, setInvalidMsg] = useState<string>('')

  const linksBreadcrumb = [`${i18n.t("header.home")}`, i18n.t("cart.cart")]
  const layoutProps = {
    lngDict, i18n, lng, brand,
    SEO: { title: `${i18n.t("cart.title")}` },
    titleHeader: i18n.t("cart.title"),
    withCart: false,
    customClassName: `${styles.cart_layout} ${styles.main__noNavbar}`
  };

  return (
    <Layout {...layoutProps}>
      <section className={styles.products_breadcumb}>
        <Breadcrumb title={i18n.t("cart.title")} links={linksBreadcrumb} lng={lng} />
      </section>

      <LazyLoadComponent>
        <section className="container">
          <div className={dataCart?.totalItem > 0 ? styles.container : styles.containerOneGrid}>
            <div className={styles.cardDetailContainer}>
              {SKUs?.length > 0 &&
                <div className={styles.cardDetailHeader}>
                  {dataCart?.totalItem > 0 &&
                    <p>
                      {i18n.t("cart.youHave")}{" "}
                      {SKUs?.length || 0}{" "}
                      {i18n.t("cart.item")}
                    </p>
                  }
                  <Link href="/[lng]/products" as={`/${lng}/products`}>
                    <p>
                      {i18n.t("cart.shoppingAgain")}
                    </p>
                  </Link>
                </div>
              }
              {invalidMsg !== "" &&
                <div className={styles.cartError}>
                  {invalidMsg}
                </div>
              }
              <CartDetails
                getSKU={(SKUs: any) => setSKUs(SKUs)}
                classes={classesCartDetails}
                itemRedirectPathPrefix="product"
                isEditable
                withProductNote
                removeIcon={<Icon.CartDetails.removeIcon />}
                onErrorMsg={(msg) => toast.error(msg)}
                onInvalidMsg={(msg) => setInvalidMsg(msg)}
                productNoteButtonElement={{
                  filled: <span>{i18n.t("cart.change")}</span>,
                  save: <span>{i18n.t("cart.save")}</span>,
                  empty: (
                    <>
                      <span className={styles.itemEditNote} />
                      <span>{i18n.t("cart.addNote")}</span>
                    </>
                  )
                }}
                thumborSetting={{
                  width: size.width < 768 ? 200 : 400,
                  format: "webp",
                  quality: 85,
                }}
                loadingComponent={
                  [0, 1, 2].map((_, i) => (
                    <div>
                      <div key={i} className={styles.placeholderContainer}>
                        <Placeholder
                          classes={classesCartPlaceholder}
                          withImage
                          withList
                          listMany={3}
                        />
                      </div>
                    </div>
                  ))
                }
                emptyCartPlaceHolder={
                  <>
                    <EmptyComponent
                      logo={<div className={styles.iconEmpty} />}
                      classes={{ emptyContainer: styles.emptyContainer }}
                      desc={i18n.t("product.isEmpty")}
                    />
                    <Link href="/lng/products" as={`/${lng}/products`}>
                      <button
                        type="submit" className={styles.continueShoppingBtn}
                        data-identity="cart-continueShoppingBtn"
                      >
                        {i18n.t("global.continueShopping")}
                      </button>
                    </Link>
                  </>
                }
              />
            </div>
            {dataCart?.totalItem > 0 &&
              <div className={styles.orderSummaryContainer}>
                <OrderSummaryBox
                  lng={lng}
                  i18n={i18n}
                  page="cart"
                />
              </div>
            }
          </div>
        </section>
      </LazyLoadComponent>
      <LazyLoadComponent>
        <ProductRecomendation
          type="crossSell"
          SKUs={SKUs}
          title={i18n.t("product.recomendation")}
        />
      </LazyLoadComponent>
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

export default Cart