/* library package */
import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import {
  useAuthToken,
  useI18n,
  ProductListByCategory
} from '@sirclo/nexus'
/* library template */
import { useBrandCommon } from 'lib/useBrand'
import useWindowSize from 'lib/useWindowSize'
import useInfiniteScroll from 'lib/useInfiniteScroll'
/* components */
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'
import Placeholder from 'components/Placeholder'
/* styles */
import styles from 'public/scss/pages/Categories.module.scss'
import styleProducts from 'public/scss/components/Products.module.scss'
import styleProductsComp from 'public/scss/components/ProductsComponent.module.scss'

const classesProductCategory = {
  productsListCategoryContainerClassName: `category_list ${styles.productsListCategoryContainer}`,
  productsListCategoryHeaderClassName: styles.productsListCategoryHeader,
  productsListCategoryHeaderTitleClassName: styles.productsListCategoryHeaderTitle,
  productsListCategoryHeaderLinkClassName: styles.productsListCategoryHeaderLink,
  productsListContainerClassName: `${styleProductsComp.productsComponent_grid} ${styleProducts.products_listContainer}`,
  productContainerClassName: `products_container ${styleProducts.products_productContainer}`,
  stickerContainerClassName: styleProducts.products_stickerContainer,
  outOfStockLabelClassName: `${styleProducts.products_label} ${styleProducts.products_outOfStockLabel}`,
  saleLabelClassName: `${styleProducts.products_label} ${styleProducts.products_saleLabel}`,
  comingSoonLabelClassName: `${styleProducts.products_label} ${styleProducts.products_comingSoonLabel}`,
  openOrderLabelClassName: `${styleProducts.products_label} ${styleProducts.products_openOrderLabel}`,
  preOrderLabelClassName: `${styleProducts.products_label} ${styleProducts.products_preOrderLabel}`,
  newLabelClassName: `${styleProducts.products_label} ${styleProducts.products_newLabel}`,
  productImageContainerClassName: styleProducts.products_productImageContainer,
  productImageClassName: styleProducts.products_productImage,
  productLabelContainerClassName: styleProducts.products_productLabelContainer,
  productTitleClassName: styleProducts.products_productTitle,
  productPriceClassName: styleProducts.products_productPrice,
  salePriceClassName: styleProducts.products_salePrice,
  priceClassName: styleProducts.products_price,
  buttonClassName: styleProducts.product_button
}

const placeholder = {
  placeholderImage: styleProductsComp.products_placeholder,
  placeholderList: styleProductsComp.products_placeholderList,
}

const CategoriesPage: FC<any> = ({
  lng,
  lngDict,
  brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const i18n: any = useI18n()
  const size: any = useWindowSize()
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    itemPerPage: 3,
    totalItems: 0,
  })
  const { currPage } = useInfiniteScroll(pageInfo, 'category_list:last-child')

  const linksBreadcrumb = [i18n.t("header.home"), i18n.t("home.productCategory")]
  const layoutProps = {
    lngDict,
    i18n,
    lng,
    brand,
    SEO: {
      title: i18n.t("product.categories")
    },
    titleHeader: i18n.t("product.categories")
  }

  const productsLoadingComponent = [0, 1, 2, 3].map((_, i) => ( <div key={i}> <Placeholder classes={placeholder} withImage withList /> </div> ))

  return (
    <Layout {...layoutProps}>
      <Breadcrumb
        lng={lng}
        links={linksBreadcrumb}
      />
      <section className="container">
        {Array.from(Array(currPage + 1)).map((_, i) => (
          <ProductListByCategory
            key={i}
            pageNumber={i}
            productCategoryType="INFINITE_SCROLL"
            itemPerPage={pageInfo.itemPerPage}
            classes={classesProductCategory}
            itemProductsPerCategory={4}
            getPageInfo={setPageInfo as any}
            thumborSetting={{
              width: size.width < 768 ? 400 : 600,
              quality: 85,
              format: 'webp'
            }}
            loadingProductsComponent={productsLoadingComponent}
            emptyStateComponent={
              <EmptyComponent
                title={i18n.t("product.emptyCategory")}
                button={
                  <Link href="/[lng]">
                    <button className={`mt-4 py-3 ${styles.btn}`}>{i18n.t("product.backToHome")}</button>
                  </Link>
                }
              />
            }
          />
        ))}
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

export default CategoriesPage
