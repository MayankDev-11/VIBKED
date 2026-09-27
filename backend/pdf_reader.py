import fitz


def extract_pages_from_pdf(pdf_path):
    document = fitz.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        page_text = page.get_text()

        pages.append({"page": page_number, "text": page_text})

    document.close()

    return pages
