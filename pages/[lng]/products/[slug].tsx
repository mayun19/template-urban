/* library package */
import {
  FC,
  useState,
  useEffect,
} from 'react'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import {
  FeaturesType,
  Products,
  TemplateFeatures,
  useAuthToken,
  useI18n
} from '@sirclo/nexus'

/* library template */
import { useBrandCommon } from 'lib/useBrand'

/* component */
import Layout from 'components/Layout/Layout'
import Placeholder from 'components/Placeholder'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import EmptyComponent from 'components/EmptyComponent/EmptyComponent'

/* styles */
import styleProducts from 'public/scss/pages/Products.module.scss'
import styles from 'public/scss/components/ProductsComponent.module.scss'
import Error404Page from 'pages/404'

export const placeholder = {
  placeholderImage: styles.products_placeholder,
  placeholderList: styles.products_placeholderList,
}

export const classesProducts = {
  productContainerClassName: `products_container ${styles.products_productContainer}`,
  stickerContainerClassName: styles.products_stickerContainer,
  outOfStockLabelClassName: `${styles.products_label} ${styles.products_outOfStockLabel}`,
  saleLabelClassName: `${styles.products_label} ${styles.products_saleLabel}`,
  comingSoonLabelClassName: `${styles.products_label} ${styles.products_comingSoonLabel}`,
  openOrderLabelClassName: `${styles.products_label} ${styles.products_openOrderLabel}`,
  preOrderLabelClassName: `${styles.products_label} ${styles.products_preOrderLabel}`,
  newLabelClassName: `${styles.products_label} ${styles.products_newLabel}`,
  productImageContainerClassName: styles.products_productImageContainer,
  productImageClassName: styles.products_productImage,
  productLabelContainerClassName: styles.products_productLabelContainer,
  productTitleClassName: styles.products_productTitle,
  productPriceClassName: styles.products_productPrice,
  salePriceClassName: styles.products_salePrice,
  priceClassName: styles.products_price,
}

const ProductsHighlightPage: FC<any> = ({
  lng,
  lngDict,
  brand,
  slugSection
}) => {
  const [titleProductSection, setTitleProductSection] = useState<string>("")

  const i18n: any = useI18n()
  const linksBreadcrumb = [i18n.t("header.home"), titleProductSection]
  const layoutProps = {
    lngDict,
    i18n,
    lng,
    brand,
    SEO: { title: titleProductSection },
    withBack: false,
    titleSeo: titleProductSection
  }
  
  const [currPage, setCurrPage] = useState(0)
  const [pageInfo, setPageInfo] = useState({
    pageNumber: 0,
    itemPerPage: 12,
    totalItems: 0,
  })
  
  const totalPage = Math.ceil(pageInfo.totalItems / pageInfo.itemPerPage)
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  })

  const handleScroll = () => {
    const lastItem = document.querySelector(
      ".products_container:last-of-type"
    ) as HTMLElement

    if (lastItem) {
      const lastItemOffset = lastItem.offsetTop + lastItem.clientHeight
      const pageOffset = window.pageYOffset + window.innerHeight
      if (pageOffset > lastItemOffset && currPage < totalPage - 1) setCurrPage(currPage + 1)
    }
  }

  const scrollToTop = () => {
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
  }

  type TProductsProps = {
    classes: any,
    getPageInfo: any,
    fullPath: string,
    pathPrefix: string,
    lazyLoadedImage: boolean,
    thumborSetting: any,
    itemPerPage: number,
    withSeparatedVariant: boolean,
    loadingComponent: any,
    emptyStateComponent: any,
    isFlipImage: boolean,
    getTitleProductSection: any,
    slug: string,
    isProductSectionHighlight: boolean,
  }

  const productsLoadingComponent = [0, 1, 2, 3].map((_, i) => ( <div key={i}> <Placeholder classes={placeholder} withImage withList /> </div> ))

  const baseProductsProps: TProductsProps = {
    classes: classesProducts,
    getPageInfo: (pageInfo: any) => setPageInfo(pageInfo),
    fullPath: `product/{id}`,
    pathPrefix: `product`,
    lazyLoadedImage: false,
    thumborSetting: {
      width: 512,
      format: "webp",
      quality: 85,
    },
    itemPerPage: 12,
    withSeparatedVariant: true,
    loadingComponent: productsLoadingComponent,
    emptyStateComponent: (
      <EmptyComponent
        logo={<div className={styles.products_iconEmpty} />}
        classes={{ emptyContainer: styles.products_emptyContainer }}
        desc={i18n.t("product.isEmpty")}
      />
    ),
    isFlipImage: true,
    getTitleProductSection: (values: string) => setTitleProductSection(values),
    slug: slugSection,
    isProductSectionHighlight: true,
  }

  return (
    <TemplateFeatures
      id={FeaturesType.PRODUCT_HIGHLIGHT}
      defaultChildren={<Error404Page />}
    >
      <Layout {...layoutProps}>
        <section className={styleProducts.productsHighlight_breadcrumb}>
          <Breadcrumb
            title={titleProductSection}
            links={linksBreadcrumb}
            lng={lng}
          />
        </section>
    
        <LazyLoadComponent>
          <>
            <section
              className={`
                container my-2 
                ${pageInfo.totalItems !== 0 ? 'pb-4' : ""}
                ${pageInfo.totalItems !== 0 ? styles.productsComponent_lastSection : ""}      
              `}
            >
              <div className={`${pageInfo.totalItems === 0 && "mb-0"}`}>
                <div className={styles["productsComponent_showResetContainer--productsHighlight"]}>
                  <p className={styles.productsComponent_show}>
                    {i18n.t("product.show")}
                    {" "}{pageInfo.totalItems}{" "}
                    {i18n.t("product.result")}
                  </p>
                </div>
                <div
                  className={`${styles.productsComponent_grid} ${'mt-0 pt-0'}
                  ${pageInfo.totalItems === 0 && "pb-0"}    
                `}
                >
                  {Array.from(Array(currPage + 1)).map((_, i) => (
                    <Products
                      key={i}
                      pageNumber={i}
                      {...baseProductsProps}                    
                    />
                  ))
                  }
                  <button onClick={scrollToTop} className={styles.productsComponent_goToTop}>
                    <div className={styles.productsComponent_arrowUp}></div>
                  </button>
                </div>
              </div>
            </section >
          </>
        </LazyLoadComponent>
      </Layout>
    </TemplateFeatures>
  )
}
export const getServerSideProps = async ({
  req,
  res,
  params
}) => {
  const { slug } = params

  const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value; 
  const { brand } = await useBrandCommon(req, params, token)

  return {
    props: {
      ...brand,
      slugSection: slug
    }
  }
}

export default ProductsHighlightPage