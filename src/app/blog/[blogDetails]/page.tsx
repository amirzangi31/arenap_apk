import React from 'react'
import BlogDetailsPage from '@templates/BlogDetailsPage'


export const generateStaticParams = async () => {
    return [{ blog: "blog_1" }, { blog: "blog_2" }, { blog: "blog_3" }, { blog: "blog_4" }, { blog: "blog_5" }, { blog: "blog_6" }, { blog: "blog_7" }]
}





const BlogDetails = ({ params }: { params: { blogDetails: string } }) => {



    return (
        <BlogDetailsPage slug={params.blogDetails}  />
    )
}

export default BlogDetails