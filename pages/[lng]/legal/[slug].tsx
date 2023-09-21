import { FC, useState } from 'react'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
    Legal,
    LegalCategories,
    useAuthToken,
    useI18n
} from '@sirclo/nexus'
import { useRouter } from 'next/router'
import { useBrandCommon } from 'lib/useBrand'
import Layout from 'components/Layout/Layout'
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import styles from 'public/scss/pages/Legal.module.scss'

type TDataLegal = {
    title: string
    lastUpdate: string
}

const classesLegal = {
    containerClassName: styles.legal
}

const classesLegalCategories = {
    legalCategoriesContainerClassName: styles.categories,
    legalCategoriesListClassName: styles.categoriesOrder,
    legalCategoriesItemClassName: styles.categoriesOrderList,
    legalCategoriesItemActiveClassName: styles.categoriesOrderListActive
}

const LegalPage: FC<any> = ({
    lng,
    lngDict,
    slug,
    brand
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const i18n: any = useI18n()
    const router = useRouter()
    const [data, setData] = useState<TDataLegal>()

    const layoutProps = {
        i18n,
        lng,
        lngDict,
        brand,
        SEO: { title: data?.title }
    }

    const linksBreadcrumb = [i18n.t("header.home"), data?.title]

    return (
        <Layout {...layoutProps}>
            <Breadcrumb 
                lng={lng}
                title={data?.title} 
                links={linksBreadcrumb} 
            />
            <div className={styles.wrapper}>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-md-8 col-lg-8">
                            <div className={styles.single}>
                                <Legal
                                    classes={classesLegal}
                                    legalKey={slug.toString()}
                                    getData={(data: TDataLegal) => setData(data)}
                                    loadingComponent={
                                        <Placeholder 
                                            withList
                                            withImage
                                            listMany={5}
                                            classes={{
                                                placeholderList: styles.placeholder
                                            }}
                                        />
                                    }
                                />
                            </div>
                        </div>
                        <div className={`col-12 col-md-4 offset-lg-1 col-lg-3 ${styles.sidebar}`}>
                            <LegalCategories
                                i18n={i18n}
                                router={router}
                                classes={classesLegalCategories}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    res,
    params
}) => {
    const { slug } = params

    const tokenData = await useAuthToken({ req, res, env: process.env }); 
	const token = tokenData.value;
    const { brand } = await useBrandCommon(req, params, token);

    return {
        props: {
            ...brand,
            slug,
        }
    }
}

export default LegalPage