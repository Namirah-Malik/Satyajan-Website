#!/usr/bin/env python3
"""
Backend API Testing for Products CMS System
Tests all CRUD operations for the Products API
"""

import requests
import json
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://solpower-backup.preview.emergentagent.com/api"

class ProductsAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_product_id = None
        self.results = []
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'response_data': response_data
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
        
    def test_get_all_products(self):
        """Test GET /api/products - should return 12 products"""
        try:
            response = requests.get(f"{self.base_url}/products", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                if len(products) == 12:
                    self.log_result("GET /api/products", True, f"Successfully fetched {len(products)} products")
                    return True
                else:
                    self.log_result("GET /api/products", False, f"Expected 12 products, got {len(products)}", products)
                    return False
            else:
                self.log_result("GET /api/products", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("GET /api/products", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_products_by_category(self):
        """Test GET /api/products?category=solar - should return 2 solar products"""
        try:
            response = requests.get(f"{self.base_url}/products?category=solar", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                if len(products) == 2:
                    self.log_result("GET /api/products?category=solar", True, f"Successfully fetched {len(products)} solar products")
                    return True
                else:
                    self.log_result("GET /api/products?category=solar", False, f"Expected 2 solar products, got {len(products)}", products)
                    return False
            else:
                self.log_result("GET /api/products?category=solar", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("GET /api/products?category=solar", False, f"Request failed: {str(e)}")
            return False
    
    def test_get_single_product(self):
        """Test GET /api/products/{product_id} - test with id: "inv-001" """
        try:
            product_id = "inv-001"
            response = requests.get(f"{self.base_url}/products/{product_id}", timeout=10)
            
            if response.status_code == 200:
                product = response.json()
                if product.get('id') == product_id:
                    self.log_result("GET /api/products/inv-001", True, f"Successfully fetched product: {product.get('name', 'Unknown')}")
                    return True
                else:
                    self.log_result("GET /api/products/inv-001", False, f"Product ID mismatch", product)
                    return False
            elif response.status_code == 404:
                self.log_result("GET /api/products/inv-001", False, "Product 'inv-001' not found in database")
                return False
            else:
                self.log_result("GET /api/products/inv-001", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("GET /api/products/inv-001", False, f"Request failed: {str(e)}")
            return False
    
    def test_create_product(self):
        """Test POST /api/products - create a new product"""
        test_product = {
            "name": "Test Inverter 2KVA",
            "sku": "TEST-INV-2K",
            "category": "inverter",
            "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500",
            "images": ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800"],
            "description": "Test product for API testing",
            "features": ["Feature 1", "Feature 2"],
            "offerPrice": 8999,
            "mrp": 11999,
            "specifications": {"Capacity": "2KVA", "Type": "Pure Sine Wave"},
            "warranty": "2 Years",
            "inStock": True
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/products", 
                json=test_product,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                created_product = response.json()
                self.test_product_id = created_product.get('id')
                self.log_result("POST /api/products", True, f"Successfully created product with ID: {self.test_product_id}")
                return True
            else:
                self.log_result("POST /api/products", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("POST /api/products", False, f"Request failed: {str(e)}")
            return False
    
    def test_update_product(self):
        """Test PUT /api/products/{product_id} - update the newly created product"""
        if not self.test_product_id:
            self.log_result("PUT /api/products/{id}", False, "No test product ID available (create test failed)")
            return False
            
        update_data = {
            "offerPrice": 7999
        }
        
        try:
            response = requests.put(
                f"{self.base_url}/products/{self.test_product_id}",
                json=update_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                updated_product = response.json()
                if updated_product.get('offerPrice') == 7999:
                    self.log_result("PUT /api/products/{id}", True, f"Successfully updated product price to ₹7999")
                    return True
                else:
                    self.log_result("PUT /api/products/{id}", False, f"Price not updated correctly", updated_product)
                    return False
            else:
                self.log_result("PUT /api/products/{id}", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("PUT /api/products/{id}", False, f"Request failed: {str(e)}")
            return False
    
    def test_delete_product(self):
        """Test DELETE /api/products/{product_id} - delete the test product"""
        if not self.test_product_id:
            self.log_result("DELETE /api/products/{id}", False, "No test product ID available (create test failed)")
            return False
            
        try:
            response = requests.delete(f"{self.base_url}/products/{self.test_product_id}", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                self.log_result("DELETE /api/products/{id}", True, f"Successfully deleted product: {result.get('message', 'Product deleted')}")
                return True
            else:
                self.log_result("DELETE /api/products/{id}", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("DELETE /api/products/{id}", False, f"Request failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            self.test_get_all_products,
            self.test_get_products_by_category,
            self.test_get_single_product,
            self.test_create_product,
            self.test_update_product,
            self.test_delete_product
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
            print()  # Add spacing between tests
        
        print("=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All backend API tests PASSED!")
            return True
        else:
            print("⚠️  Some backend API tests FAILED!")
            return False
    
    def get_summary(self):
        """Get a summary of test results"""
        passed = sum(1 for r in self.results if r['success'])
        total = len(self.results)
        
        summary = {
            'total_tests': total,
            'passed': passed,
            'failed': total - passed,
            'success_rate': (passed / total * 100) if total > 0 else 0,
            'results': self.results
        }
        
        return summary

def main():
    """Main test execution"""
    tester = ProductsAPITester()
    success = tester.run_all_tests()
    
    # Print detailed summary
    summary = tester.get_summary()
    print(f"\n📋 Detailed Summary:")
    print(f"   Success Rate: {summary['success_rate']:.1f}%")
    print(f"   Passed: {summary['passed']}")
    print(f"   Failed: {summary['failed']}")
    
    if not success:
        print("\n❌ Failed Tests:")
        for result in summary['results']:
            if not result['success']:
                print(f"   - {result['test']}: {result['message']}")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())