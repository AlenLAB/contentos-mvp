import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PostcardInsert, PostcardUpdate, isValidPostState, isValidPostTemplate } from '@/types/database'

// GET: Fetch all postcards
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state')
    const template = searchParams.get('template')
    const orderBy = searchParams.get('orderBy') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    let query = supabase.from('postcards').select('*')

    // Apply filters if provided
    if (state && isValidPostState(state)) {
      query = query.eq('state', state)
    }

    if (template) {
      if (template === 'null') {
        query = query.is('template', null)
      } else if (isValidPostTemplate(template)) {
        query = query.eq('template', template)
      }
    }

    // Apply ordering
    query = query.order(orderBy as any, { ascending: order === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch postcards' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      postcards: data || [],
      count: data?.length || 0,
    })
  } catch (error) {
    console.error('GET postcards error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch postcards' },
      { status: 500 }
    )
  }
}

// POST: Create a new postcard
export async function POST(request: NextRequest) {
  try {
    // Check for empty body
    const contentLength = request.headers.get('content-length')
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }
    
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('POST postcard error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
    
    // Validate required fields - Allow empty Swedish content for async translation
    if (!body.english_content) {
      return NextResponse.json(
        { error: 'English content is required' },
        { status: 400 }
      )
    }

    // Validate state if provided
    if (body.state && !isValidPostState(body.state)) {
      return NextResponse.json(
        { error: 'Invalid post state' },
        { status: 400 }
      )
    }

    // Validate template if provided
    if (body.template !== undefined && body.template !== null && !isValidPostTemplate(body.template)) {
      return NextResponse.json(
        { error: 'Invalid post template' },
        { status: 400 }
      )
    }

    const postcard: PostcardInsert = {
      english_content: body.english_content,
      swedish_content: body.swedish_content || '',  // Allow empty for async translation
      state: body.state || 'draft',
      template: body.template || null,
      scheduled_date: body.scheduled_date || null,
      published_date: body.published_date || null,
      // translation_status will be added once database migration is run
      // translation_status: body.translation_status || (body.swedish_content ? 'completed' : 'pending'),
    }

    const { data, error } = await supabase
      .from('postcards')
      .insert(postcard as any) // Type cast for Supabase compatibility
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create postcard' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      postcard: data,
    })
  } catch (error) {
    console.error('POST postcard error:', error)
    return NextResponse.json(
      { error: 'Failed to create postcard' },
      { status: 500 }
    )
  }
}

// PUT: Update a postcard
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Postcard ID is required' },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const update: PostcardUpdate = {}
    
    if (body.english_content !== undefined) {
      update.english_content = body.english_content
    }
    
    if (body.swedish_content !== undefined) {
      update.swedish_content = body.swedish_content
    }
    
    if (body.state !== undefined) {
      if (!isValidPostState(body.state)) {
        return NextResponse.json(
          { error: 'Invalid post state' },
          { status: 400 }
        )
      }
      update.state = body.state
    }
    
    if (body.template !== undefined) {
      if (body.template !== null && !isValidPostTemplate(body.template)) {
        return NextResponse.json(
          { error: 'Invalid post template' },
          { status: 400 }
        )
      }
      update.template = body.template
    }
    
    if (body.scheduled_date !== undefined) {
      update.scheduled_date = body.scheduled_date
    }
    
    if (body.published_date !== undefined) {
      update.published_date = body.published_date
    }

    // Mark as published if published_date is set
    if (body.published_date && !body.state) {
      update.state = 'published'
    }

    const { data, error } = await supabase
      .from('postcards')
      .update(update)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update postcard' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Postcard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      postcard: data,
    })
  } catch (error) {
    console.error('PUT postcard error:', error)
    return NextResponse.json(
      { error: 'Failed to update postcard' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a postcard
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Postcard ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('postcards')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete postcard' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Postcard deleted successfully',
    })
  } catch (error) {
    console.error('DELETE postcard error:', error)
    return NextResponse.json(
      { error: 'Failed to delete postcard' },
      { status: 500 }
    )
  }
}