export const groupByYear = (news) => {
    return news.reduce((acc, item) => {
        const year = new Date(item.datePublished).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(item);
        return acc;
    }, {});
};
