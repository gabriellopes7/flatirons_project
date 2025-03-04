import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';
import { 
    ProductListContainer,
    ProductGrid, 
    ProductCard, 
    ProductTitle, 
    ProductDescription, 
    ProductPrice, 
    FilterContainer, 
    FilterInput, 
    FilterButton, 
    NoProducts,
    PageButton,
    PaginationContainer,
    SelectFilter,
    DateInput,
    CurrencySelector,
    ExchangeRatesContainer,
    ExchangeRateItem
} from '../styles/ProductList';
import { ProductFilters, ProductResponse, PaginatedResponse, ExchangeRate } from '../types/product.interface';

const ProductList = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('usd');
    const [filters, setFilters] = useState<ProductFilters>({
        name: '',
        minPrice: undefined,
        maxPrice: undefined,
        fromDate: '',
        toDate: '',
        sortBy: 'name',
        sortOrder: 'ASC',
        page: 1,
        limit: 25
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);           
            const params = new URLSearchParams();
            if (filters.name) params.append('name', filters.name);
            if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
            if (filters.fromDate) params.append('fromDate', filters.fromDate);
            if (filters.toDate) params.append('toDate', filters.toDate);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());           
            const response = await apiService.get<PaginatedResponse>(`/products?${params.toString()}`);            
            console.log('API Response:', response.data);    
            if (response.data && response.data.data && Array.isArray(response.data.data)) {                
                setProducts(response.data.data);       
                if (response.data.meta) {
                    setTotalItems(response.data.meta.total);
                    setTotalPages(response.data.meta.totalPages);
                }                
                setError(null);
            } else {
                console.error('Unexpected response format:', response.data);
                setError('Unexpected API response format');
                setProducts([]);
            }            
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Unable to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();        
    }, []); 

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setFilters(prev => ({
                ...prev,
                page: newPage
            }));         
        }
    };

    useEffect(() => {        
        if (!loading) {
            fetchProducts();
        }
    }, [filters.page, filters.limit]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;     
        if (name === 'minPrice' || name === 'maxPrice') {
            setFilters(prev => ({
                ...prev,
                [name]: value ? Number(value) : undefined
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCurrency(e.target.value);
    };

    const applyFilters = () => {
        setFilters(prev => ({
            ...prev,
            page: 1 
        }));
        fetchProducts();
    };

    const formatPrice = (priceStr: string, exchangeRates: ExchangeRate[] = []) => {
        if (!priceStr) return '$0.00';        
        const price = parseFloat(priceStr);
        if (selectedCurrency === 'usd' || !exchangeRates || exchangeRates.length === 0) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        }        
        const exchangeRate = exchangeRates.find(rate => rate.currency === selectedCurrency);
        if (!exchangeRate) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        }        
        const convertedPrice = price * parseFloat(exchangeRate.rate);        
        const currencyFormatMap: Record<string, { locale: string, currency: string }> = {
            'brl': { locale: 'pt-BR', currency: 'BRL' },
            'eur': { locale: 'de-DE', currency: 'EUR' },
            'gbp': { locale: 'en-GB', currency: 'GBP' },
            'cad': { locale: 'en-CA', currency: 'CAD' },
            'mxn': { locale: 'es-MX', currency: 'MXN' }
        };        
        const format = currencyFormatMap[selectedCurrency] || { locale: 'en-US', currency: 'USD' };        
        return new Intl.NumberFormat(format.locale, {
            style: 'currency',
            currency: format.currency
        }).format(convertedPrice);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getCurrencySymbol = (currency: string) => {
        const symbols: Record<string, string> = {
            'usd': '$',
            'brl': 'R$',
            'eur': '€',
            'gbp': '£',
            'cad': 'C$',
            'mxn': 'MX$'
        };        
        return symbols[currency] || currency.toUpperCase();
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;
        const currentPage = filters.page || 1;
        const pages = [];
        pages.push(
            <PageButton 
                key="first" 
                onClick={() => handlePageChange(1)} 
                $active={currentPage === 1}
                disabled={currentPage === 1}
            >
                &laquo;
            </PageButton>
        );
        pages.push(
            <PageButton 
                key="prev" 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                &lsaquo;
            </PageButton>
        );
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PageButton 
                    key={i} 
                    onClick={() => handlePageChange(i)} 
                    $active={currentPage === i}
                >
                    {i}
                </PageButton>
            );
        }
        pages.push(
            <PageButton 
                key="next" 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                &rsaquo;
            </PageButton>
        );
        pages.push(
            <PageButton 
                key="last" 
                onClick={() => handlePageChange(totalPages)} 
                $active={currentPage === totalPages}
                disabled={currentPage === totalPages}
            >
                &raquo;
            </PageButton>
        );
        return (
            <PaginationContainer>
                {pages}
            </PaginationContainer>
        );
    };

    const renderLoadingState = () => (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            flexDirection: 'column',
            gap: '20px'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #4a90e2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p>Loading products...</p>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );

    return (
        <ProductListContainer>
            <h2>Available Products</h2>            
            <FilterContainer>
                <FilterInput
                    type="text"
                    name="name"
                    placeholder="Product name"
                    value={filters.name || ''}
                    onChange={handleFilterChange}
                />
                <FilterInput
                    type="number"
                    name="minPrice"
                    placeholder="Minimum price"
                    value={filters.minPrice || ''}
                    onChange={handleFilterChange}
                />
                <FilterInput
                    type="number"
                    name="maxPrice"
                    placeholder="Maximum price"
                    value={filters.maxPrice || ''}
                    onChange={handleFilterChange}
                />
                <DateInput
                    type="date"
                    name="fromDate"
                    placeholder="Start date"
                    value={filters.fromDate || ''}
                    onChange={handleFilterChange}
                />
                <DateInput
                    type="date"
                    name="toDate"
                    placeholder="End date"
                    value={filters.toDate || ''}
                    onChange={handleFilterChange}
                />
                <SelectFilter
                    name="sortBy"
                    value={filters.sortBy || 'name'}
                    onChange={handleFilterChange}
                >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="expiration">Expiration Date</option>
                </SelectFilter>
                <SelectFilter
                    name="sortOrder"
                    value={filters.sortOrder || 'ASC'}
                    onChange={handleFilterChange}
                >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                </SelectFilter>
                <SelectFilter
                    name="limit"
                    value={filters.limit || 25}
                    onChange={handleFilterChange}
                >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </SelectFilter>
                <FilterButton onClick={applyFilters}>Filter</FilterButton>                
                <CurrencySelector
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                >
                    <option value="usd">USD ($)</option>
                    <option value="brl">BRL (R$)</option>
                    <option value="eur">EUR (€)</option>
                    <option value="gbp">GBP (£)</option>
                    <option value="cad">CAD (C$)</option>
                    <option value="mxn">MXN (MX$)</option>
                </CurrencySelector>
            </FilterContainer>
            {loading ? (
                renderLoadingState()
            ) : error ? (
                <NoProducts>{error}</NoProducts>
            ) : products.length === 0 ? (
                <NoProducts>No products found matching your criteria.</NoProducts>
            ) : (
                <>
                    <div style={{ 
                        margin: '20px 0', 
                        textAlign: 'center', 
                        color: '#666' 
                    }}>
                        Showing {products.length} of {totalItems} products
                    </div>
                    <ProductGrid>
                        {products.map(product => (
                            <ProductCard key={product.id}>
                                <ProductTitle>{product.name}</ProductTitle>
                                <ProductDescription>
                                    {product.uploadBatch?.id || 'No description available'}
                                </ProductDescription>
                                <ProductPrice>
                                    {formatPrice(product.price, product.uploadBatch?.exchangeRates || [])}
                                </ProductPrice>
                                <ProductDescription>
                                    <strong>Expiration:</strong> {formatDate(product.expiration)}
                                </ProductDescription>
                                {product.uploadBatch?.exchangeRates && product.uploadBatch.exchangeRates.length > 0 && (
                                    <ExchangeRatesContainer>
                                        <small>Exchange rates:</small>
                                        {product.uploadBatch.exchangeRates.slice(0, 3).map((rate: ExchangeRate) => (
                                            <ExchangeRateItem key={rate.currency}>
                                                <span>{getCurrencySymbol(rate.currency)}</span>
                                                <span>{rate.rate}</span>
                                            </ExchangeRateItem>
                                        ))}
                                    </ExchangeRatesContainer>
                                )}
                            </ProductCard>
                        ))}
                    </ProductGrid>
                    {renderPagination()}
                </>
            )}
        </ProductListContainer>
    );
};


export default ProductList; 